const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;

var board_offset_left;
var board_offset_top;

var canvas = document.querySelector('canvas');


var start_offset = 0;
var block_dimension =  window.innerHeight * 0.0525;
var board_dimension = block_dimension * 16 + 1;

var colors = ["#ff0000", "#197319", "#0000ff", "#ffff00"];
var token_img = ['boss',
		  'merrong_red', 'threeeyes_red','rabbit_red', 'bear_red',
		  'merrong_green', 'threeeyes_green', 'rabbit_green', 'bear_green',
		  'merrong_blue', 'threeeyes_blue', 'rabbit_blue', 'bear_blue',
		  'merrong_yellow', 'threeeyes_yellow', 'rabbit_yellow', 'bear_yellow'];

var board = [];
var walls_vertical = [[0, 1], [0, 9], [1, 3], [1, 13], [2, 1], [2, 10], [3, 6], [6, 2], [6, 13], 
	[7, 10], [7, 6], [7, 8], [8, 8], [8, 6], [9, 3], [10, 1], [10, 7], [10, 12], [11, 10], [12, 13], [13, 5], [14, 2], [14, 9], [15, 3], [15, 11]];
var walls_horizontal = [[0, 4], [0, 14], [1, 1], [2, 11], [3, 6], [3, 15], [5, 0], [6, 3], [6, 13], [6, 10], [6, 7], [6, 8], [8, 7], [8, 8], [8, 15], [9, 4],
	[9, 13], [9, 8], [9, 1], [11, 0], [11, 10], [12, 14], [12, 6], [13, 9], [14, 2]];

// 0: SILVER, 1-4: RED, 5-8: GREEN, 9-12: YELLOW, 13-16: BLUE
// STAR, MOON, SUN, PLANET
var token_positions = [[10, 8], [10, 13], [1, 4], [1, 14], [14, 2], [10, 1], [6, 13], [2, 1], [11, 10], [3, 6], [9, 4], [12, 14], [7, 10], 
	[2, 11], [14, 9], [13, 6], [6, 3]];

// RED, GREEN, YELLOW, BLUE
var pad_positions = [[6, 7], [4, 15], [7, 0], [7, 11]];

var robots = [];

function fitToContainer(canvas){
	canvas.style.width='100%';
	canvas.style.height = '100%';
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}
fitToContainer(canvas);
function Point (row, col) {
	this.row = row;
	this.col = col;
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	this.token = -1;
	this.robot = -1;
	this.pad = -1;
}

Point.prototype = {
	constructor: Point,
	get_position: function () {
		return {'row': this.row, 'col': this.col};
	},

	get_left: function () { return this.left; },
	get_right: function () { return this.right; },
	get_up: function () { return this.up; },
	get_down: function () { return this.down; },
	get_token: function () { return this.token; },
	get_robot: function () { return this.robot; },
	get_pad: function () { return this.pad; },

	set_left: function (val) { this.left = val; },
	set_right: function (val) { this.right = val; },
	set_up: function (val) { this.up = val; },
	set_down: function (val) { this.down = val; },
	set_token: function (val) { this.token = val; },
	set_robot: function (val) { this.robot = val; },
	set_pad: function (val) { this.pad = val; }
}

function initialize_board () {
	for (var i = 0; i < 16; i ++) {
		var row = [];

		for (var j = 0; j < 16; j++) {
			var point = new Point(i, j);
			row.push(point);
		}	
		board.push(row);
	}
}

function initialize_walls () {
	for (var i = 0; i < 16; i++) {
		board[0][i].set_up(true);
		board[15][i].set_down(true);
		board[i][0].set_left(true);
		board[i][15].set_right(true);
	}

	for (var i = 0; i < walls_vertical.length; i++) {
		board[walls_vertical[i][0]][walls_vertical[i][1]].set_right(true);
		board[walls_vertical[i][0]][walls_vertical[i][1] + 1].set_left(true);
	}

	for (var i = 0; i < walls_horizontal.length; i++) {
		board[walls_horizontal[i][0] + 1][walls_horizontal[i][1]].set_up(true);
		board[walls_horizontal[i][0]][walls_horizontal[i][1]].set_down(true);
	}
}

function initialize_tokens () {
	for (var i = 0; i < token_positions.length; i++) {
		board[token_positions[i][0]][token_positions[i][1]].set_token(i);
	}

	//console.log("pad positions: " + pad_positions.length);
	for (var i = 0; i < pad_positions.length; i++) {
		//board[pad_positions[i][0]][pad_positions[i][1]].set_pad(i);
		board[pad_positions[i][0]][pad_positions[i][1]].set_robot(i);
	}
}

function initialize_robots () {
	for (var i = 0; i < pad_positions.length; i++) {
		var row = pad_positions[i][0];
		var col = pad_positions[i][1];

		var circle = new createjs.Shape();
		var command = circle.graphics.setStrokeStyle(1).command;
		circle.graphics.beginStroke("black").beginFill(colors[i]).drawCircle(0, 0, 10);
		circle.x = block_dimension*col + 16;
		circle.y = block_dimension*row + 16;

		var robot = { "row": row, "col": col, "item": circle, "command": command };
		robots.push(robot);
	}
}

function draw_board () {
	var line = new createjs.Shape();
	line.graphics.beginStroke("#ddd");

	for (var x = start_offset; x < board_dimension; x += block_dimension) {
		line.graphics.moveTo(x, 0);
		line.graphics.lineTo(x, board_dimension);
		stage.addChild(line);	
	}

	for (var y = start_offset; y < board_dimension; y += block_dimension) {
		line.graphics.moveTo(0, y);
		line.graphics.lineTo(board_dimension, y);
		stage.addChild(line);
	}

	line.graphics.endStroke();
}

function draw_wall (point) {
	var row = point.get_position().row;
	var col = point.get_position().col;

	var line = new createjs.Shape();
	line.graphics.setStrokeStyle(2).beginStroke("#000");

	if (point.get_up()) {
		line.graphics.moveTo(block_dimension*col, block_dimension*row);
		line.graphics.lineTo(block_dimension*col + block_dimension, block_dimension*row);
		stage.addChild(line);	
	}

	if (point.get_down()) {
		line.graphics.moveTo(block_dimension*col, block_dimension*row + block_dimension);
		line.graphics.lineTo(block_dimension*col + block_dimension, block_dimension*row + block_dimension);
		stage.addChild(line);	
	}

	if (point.get_left()) {
		line.graphics.moveTo(block_dimension*col, block_dimension*row);
		line.graphics.lineTo(block_dimension*col, block_dimension*row + block_dimension);
		stage.addChild(line);	
	}

	if (point.get_right()) {
		line.graphics.moveTo(block_dimension*col + block_dimension, block_dimension*row);
		line.graphics.lineTo(block_dimension*col + block_dimension, block_dimension*row + block_dimension);
		stage.addChild(line);	
	}

	line.graphics.endStroke();
}

function draw_token (point) {
	var token = point.get_token();

	if (token != -1) {
		var row = point.get_position().row;
		var col = point.get_position().col;


		var x = col*block_dimension + 2;
		var y = row*block_dimension + 2;

		path = '/imgs/' + token_img[token];
		var bitmap = new createjs.Bitmap(path);
		bitmap.x = x;
		bitmap.y = y;
		bitmap.scaleX = 0.33;
		bitmap.scaleY = 0.33;
		stage.addChild(bitmap);

		// var text = new createjs.Text(token, "16px Arial", "#ff7700");
		// text.x = col*block_dimension + 10;
		// text.y = row*block_dimension + 10;
		// stage.addChild(text);
	}
}

function draw_pad (point) {
	var pad = point.get_pad();

	if (pad != -1) {
		var row = point.get_position().row;
		var col = point.get_position().col;

		var rect = new createjs.Shape();
		rect.graphics.beginFill(colors[pad]).drawRect(block_dimension*col + 1, block_dimension*row + 1, block_dimension, block_dimension);
		stage.addChild(rect);
	}
}

function draw_robot (robot) {
	stage.addChild(robot.item);
}

function draw () {
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 16; j++) {
			var point = board[i][j];
			draw_wall(point);
			draw_token(point);
			//draw_pad(point);
		}	
	}

	for (var i = 0; i < robots.length; i++) {
		draw_robot(robots[i]);
	}

	stage.update();
}

function calculate_new_position (index, direction) {
	var row = robots[index].row;
	var col = robots[index].col;
	
	if (direction == UP) {
		for (var i = row; i >= 0; i--) {
			if (i != row && board[i][col].get_robot() != -1) {
				return board[i+1][col].get_position();
			}
			if (board[i][col].get_up()) {
				return board[i][col].get_position();
			}
		}
	} else if (direction == RIGHT) {
		for (var i = col; i < 16; i++) {
			if (i != col && board[row][i].get_robot() != -1) {
				return board[row][i-1].get_position();
			}
			if (board[row][i].get_right()) {
				return board[row][i].get_position();
			}
		}
	} else if (direction == DOWN) {
		for (var i = row; i < 16; i++) {
			if (i != row && board[i][col].get_robot() != -1) {
				return board[i-1][col].get_position();
			}
			if (board[i][col].get_down()) {
				return board[i][col].get_position();
			}
		}
	} else if (direction == LEFT) {
		for (var i = col; i >= 0; i--) {
			if (i != col && board[row][i].get_robot() != -1) {
				return board[row][i+1].get_position();
			}
			if (board[row][i].get_left()) {
				return board[row][i].get_position();
			}
		}
	}
	console.log("ERROR IN calculate_new_position");
}

function get_robot_position (index) {
	return {'row': robots[index].row, 'col': robots[index].col};
}

function compare_positions (old_pos, new_pos) {
	return (old_pos.row == new_pos.row && old_pos.col == new_pos.col);
}

function update_board (index, old_pos, new_pos) {
	board[old_pos.row][old_pos.col].set_robot(-1);
	board[new_pos.row][new_pos.col].set_robot(index);
	console.log(new_pos.row + " " + new_pos.col + " " + board[new_pos.row][new_pos.col].get_robot());
}

function change_robot (old_i, new_i) {
	current_robot = new_i;
	robots[old_i].command.width = 1;
	robots[new_i].command.width = 3;
	stage.update();
}

function animate_robot (index, new_pos) {
	LOCK = 0;

	var circle = robots[index].item;

	robots[index].row = new_pos.row;
	robots[index].col = new_pos.col;
	
	console.log("row: " + new_pos.row + " col: " + new_pos.col);

	createjs.Tween.get(circle, {loop: false})
		.to({x: new_pos.col*block_dimension + 16, y: new_pos.row*block_dimension + 16}, 500, createjs.Ease.getPowInOut(1))
		.call(function() {
			LOCK = 1;
			detect();
		});
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", stage);
}

function token2robot(token) {
	if (token == 0) return 0;
	return Math.floor((current_token - 1) / 4);
}

function detect() {
	var token_row = token_positions[current_token][0];
	var token_col = token_positions[current_token][1];
	if (board[token_row][token_col].get_robot() == token2robot(current_token)) {
		send_answer();
		next_stage();
	}
}

function update_token(token) {
	if (current_token_view == null) {
		path = '/imgs/' + token_img[token];
		var current_token_view = new createjs.Bitmap(path);
		current_token_view.x = 7*block_dimension + 2;
		current_token_view.y = 7*block_dimension + 2;
		current_token_view.scaleX = 0.72;
		current_token_view.scaleY = 0.72;
		stage.addChild(current_token_view);

		// current_token_view = new createjs.Text(token, "33px Arial", "#000000");
		// current_token_view.x = 7*block_dimension + 33;
		// current_token_view.y = 7*block_dimension + 33;
		// stage.addChild(current_token_view);
	} else {
		current_token_view.image = token;
	}

	stage.update();
}

function next_stage() {
	console.log("congratz");

	// scores = [];
	$("#p-round").text(round+"R");
	
	for (var i = 0; i < 17; i++) {
		var myimg = $('#'+i.toString());
		if (i == token_id) {
			myimg.attr('class', 'column');
		} else {
			myimg.attr('class', 'column_fadeout');
		}
	}

	//var image = '/imgs/' + token_img[token_id];



	current_robot = token2robot(current_token);

	update_token(current_token);
	reset_board();
}

function reset_board() {
	for (var i = 0; i < 4; i++) {
		var row = pad_positions[i][0];
		var col = pad_positions[i][1];

		board[robots[i].row][robots[i].col].set_robot(-1);
		board[row][col].set_robot(i);

		robots[i].row = row;
		robots[i].col = col;
		robots[i].item.x = block_dimension*col + 16;
		robots[i].item.y = block_dimension*row + 16;
		
		if (current_robot == i) {
			robots[i].command.width = 3;
		} else {
			robots[i].command.width = 1;
		}
	}
	stage.update();
}

function color2number (color) {
	switch (color) {
		case 'R': return 0;
		case 'G': return 1;
		case 'B': return 2;
		case 'Y': return 3;
	}
}

function animate_answer (instruction) {

	var this_robot = color2number(instruction[0]);
	var old_pos = get_robot_position(this_robot);
	switch (instruction[1]) {
		case 'W': // left
			var new_pos = calculate_new_position(this_robot, LEFT);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(this_robot, old_pos, new_pos);
				animate_robot(this_robot, new_pos);
			}
			break;
		case 'N': // up
			var new_pos = calculate_new_position(this_robot, UP);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(this_robot, old_pos, new_pos);
				animate_robot(this_robot, new_pos);
			}
			break;
		case 'E': // right
			var new_pos = calculate_new_position(this_robot, RIGHT);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(this_robot, old_pos, new_pos);
				animate_robot(this_robot, new_pos);
			}
			break;
		case 'S': // down
			var new_pos = calculate_new_position(this_robot, DOWN);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(this_robot, old_pos, new_pos);
				animate_robot(this_robot, new_pos);
			}
			break;
	}
}

function animate_answers (data) {
	console.log(data);

	// for (var i = 0; i < data.length; i++) {
	// 	var instruction = data[i].split('');
	// 	setTimeout(animate_answer(instruction), 750 * i);
	// }
}

// SOCKETS

socket = io();
socket.connect('http://52.79.200.191:3000/');

function initialize_socket (nick) {
	socket.emit("set-nickname", nick);
}

function send_answer() {
	socket.emit("send-score", total_moves);
}

socket.on('new-stage', function (data) {
	console.log('new-stage');
	pad_positions = data.robots;

	console.log("current token " + data.token);
	round = data.round;
	token_id = data.token_id;

	current_token = data.token;
	next_stage();
});

socket.on('update-time', function (data) {
	$('#time').text(int2time(data));
});

socket.on('send-score', function (data) {
	scores.push(data);
});

socket.on('show-answer', function (data) {
	reset_board();
	animate_answers(data);
});

// TIMER

function int2time(current_time) {
	var seconds = current_time % 60;
	var minutes = Math.floor(current_time / 60);
	return minutes + " : " + seconds;
}

// GLOBALS
scores = [];
// remaining_tokens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
current_token = 1;
current_robot = 0;
total_moves = 0;

current_token_view = null;

// EXECUTION

initialize_board();
initialize_walls();
initialize_tokens();
initialize_robots();

$(document).ready(function () {
	LOCK = 1;
	stage = new createjs.Stage("board");
	nickname = $("nickname").text().trim();
	initialize_socket(nickname);

	draw_board();
	draw();
	
	// next_stage();

	$(document).keydown(keyboard_listener)
});

// LISTENERS

var keyboard_listener = function (e) {
	if (LOCK == 0) return;

	var old_pos = get_robot_position(current_robot);
	switch (e.which) {
		case 37: // left
			var new_pos = calculate_new_position(current_robot, LEFT);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(current_robot, old_pos, new_pos);
				animate_robot(current_robot, new_pos);
			}
			break;
		case 38: // up
			var new_pos = calculate_new_position(current_robot, UP);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(current_robot, old_pos, new_pos);
				animate_robot(current_robot, new_pos);
			}
			break;
		case 39: // right
			var new_pos = calculate_new_position(current_robot, RIGHT);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(current_robot, old_pos, new_pos);
				animate_robot(current_robot, new_pos);
			}
			break;
		case 40: // down
			var new_pos = calculate_new_position(current_robot, DOWN);
			if (!compare_positions(old_pos, new_pos)) {
				total_moves++;
				update_board(current_robot, old_pos, new_pos);
				animate_robot(current_robot, new_pos);
			}
			break;
		case 32: // spacebar
			change_robot(current_robot, (current_robot + 1) % 4);
	}
};
