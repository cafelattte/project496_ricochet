module.exports = function (app, Models)
{
    app.get('/', function (req, res) {
        console.log("GET /");
        res.render("home.html");
    })

    app.post('/', function (req, res) {
    	console.log("GET /main");

        var nickname = req.body.nickname;
        console.log(nickname);
    	res.render("main.html");
    })
}
