// [LOAD PACKAGES]
var express		= require('express');
var app 		= express();
var http 		= require('http').Server(app);
var io 			= require('socket.io')(http);
var bodyParser  = require('body-parser');
var mongoose 	= require('mongoose');
var path 		= require('path');
var PythonShell = require('python-shell');
var fs			= require('fs');
// var router 		= require('./routes')(app);

// PythonShell setting
var options = {
	mode: 'text',
	pythonPath: '',
	pythonOptions: ['-u'],
	scriptPath: './',
};

// [CONFIGURE APP]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// GAMEPLAY

token = 0;
token_id = [];
//invalid_positions = [168, 173, 20, 30, 226, 161, 109, 33, 186, 43, 233, 214, 99, 54, 148, 206, 122, 119, 120, 135, 136];
invalid_positions = [0xA8, 0xAD, 0x14, 0x1E, 0xE2, 0xA1, 0x6D, 0x21, 0xBA, 0x2B, 0xE9, 0xD6, 0x63, 0x36, 0x94, 0xCE, 0x7A, 0x77, 0x78, 0x87, 0x88];
current_robot_positions = [];
MAX_TIME = 30;
TIMER = MAX_TIME;
scores = [];
answers = "";


function get_next_robots () {
	var numbers = []
	while (numbers.length < 4) {
	    var number = Math.floor(Math.random() * 16*16);
	    if (numbers.indexOf(number) > -1) continue;
	    if (invalid_positions.indexOf(number) > -1) continue;
	    numbers.push(number);
	}
	return numbers;
}

function numbers2positions (array) {
	var result = []	;
	for (var i = 0; i < array.length; i++) {
		result.push([Math.floor(array[i] / 16), array[i] % 16]);
	}
	return result;
}

function get_token () {
	if (token_id.length == 17) {
		token_id = [];
		var id = Math.floor(Math.random() * 17);
		token_id.push(id);
		return id;
	} else if (token_id.length != 17) {
		while (true) {
			var id = Math.floor(Math.random() * 17);
			if (token_id.indexOf(id) == -1) {
				token_id.push(id);
				return id;
			}
		}
	}
}

function call_answer_function(tokenId) {
	var token_position = invalid_positions[tokenId];

	var data = '';
	if (tokenId == 0) {
		data = data + '4\n';
	} else {
		var color = parseInt((tokenId-1)/4);
		data = data + String(color) + '\n';
	}
	for (var i = 0; i < 4; i++) {
		data = data + current_robot_positions[i].toString();
		if (i != 3) {
			data = data + ',';
		}
	}
	data = data + '\n' + token_position.toString();
	fs.writeFile('map.txt', data, 'utf-8', function(err) {
		if (err) throw err;
		console.log('file write complete');
	});
	
	PythonShell.run('ricochet.py', function(err) {
		if (err) throw err;
		fs.readFile('answer_map.txt', 'utf-8', function(err, data) {
			if (err) throw err;
			console.log('file read complete');
			console.log(data);
			answers = data;
		});
		console.log('python finished');
	});
}

function next_stage(new_stage) {
	if (new_stage) {
		current_robot_positions = get_next_robots();
		token = get_token();
		call_answer_function(token);
	}
	io.sockets.emit("new-stage", {"robots": numbers2positions(current_robot_positions), "time": TIMER, "token": token, "round": token_id.length, "token_id": token_id[token_id.length-1]});
}

function tick() {
	io.sockets.emit('update-time', TIMER);

	if (TIMER <= 0) {
		TIMER = MAX_TIME;
		console.log("answers " + answers);
		io.sockets.emit('show-answer', answers.trim().split(" "));
		next_stage(true);
		// clearInterval(tick);

		// setTimeout(function () {
		// 	// setInterval(tick, 1000);
		// 	next_stage(true);
		// }, (answers.split(" ").length + 1) * 800);
	}
		
	TIMER--;
}

function main () {
	current_robot_positions = get_next_robots();
	token = get_token();
	setInterval(tick, 1000);
}

main();

// SOCKETS

io.on('connection', function (socket) {
	console.log('[NEW CONNECTION]	' + socket.id);

	next_stage(false);

	socket.on("set-nickname", function (nickname) {
		console.log(nickname);
		socket.nickname = nickname;
	})

	socket.on("send-score", function (score) {
		var data = {"nickname": socket.nickname, "score": score}
		console.log(data);
		scores.push(data);
		io.sockets.emit("send-score", data);
	});

	socket.on("disconnect", function () {
		console.log('[DISCONNECT]');
	});
});

// ROUTING

app.get('/', function (req, res) {
    console.log("GET /");
    res.render("home.html");
})

app.post('/', function (req, res) {
	console.log("GET /main");

    var nickname = req.body.nickname;
    console.log(nickname);
	res.render("main.html", {"nickname": nickname});
})

app.get('/imgs/:id', function (req, res) {
	fs.readFile('views/tokens/'+req.params.id+'.png', function(error, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});
app.get('/img/robot/:id', function (req, res) {
	fs.readFile('views/robot/'+req.params.id+'.png', function(error, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});


http.listen(app.get('port'), function () {
	console.log("Server listening to port " + app.get('port'));
});
