var PORT = 8000,
    HOST = "localhost",
    SESSION_TIMEOUT = 60 * 1000,
    fu = require("./fu"),
    sys = require("sys"),
    qs = require("querystring"),
    players = [],
    player_counter = 0,
    waiting_callbacks = [],
    player_callbacks = [];

setInterval(function () {
	var now = new Date();
	player_callbacks = player_callbacks.filter(function(callback) {
		var keep =  (now - callback.time < SESSION_TIMEOUT);		
		if (!keep) {
		    callback.func();
		    sys.puts("Retiring callback...");
		}
		return keep;
		    });
    }, 1000);

var play = function(req, res) {

}

var player_count = function(req, res) {
    sys.puts("Players: " + JSON.stringify(players));
    var callback = function() {
	    res.simpleJSON(200, {players: player_callbacks.length});
    };
    player_callbacks.push({func: callback, time: new Date()});
};

var join = function(req, res) {
    player_counter++;
    players.push(player_counter);
    sys.puts("Player " + player_counter + " joined.");
    sys.puts("Listeners: " + JSON.stringify(player_callbacks));
    for(i=0; i<player_callbacks.length; i++) player_callbacks[i].func();
    player_callbacks = [];
    res.simpleJSON(200, {"id": player_counter, players: player_callbacks.length});
}

var leave = function(req, res) {
    var id = qs.parse(url.parse(req.url).query).id;
    sys.puts("Player " + id + " leaving...");
    var l = 0;
    while (l < players.length) {
	if (players[l] == id) players.splice(j, 1);
	else j++;
    }
    sys.puts("Player " + id + " left.");
    res.simpleJSON(200, {});
}


fu.listen(PORT, HOST);
fu.get("/about/", fu.staticHandler("static/about.html"));
fu.get("/", fu.staticHandler("static/index.html"));
fu.get("/static/cr.css", fu.staticHandler("static/cr.css"));
fu.get("/static/cr.js", fu.staticHandler("static/cr.js"));
fu.get("/join/", join);
fu.get("/play/", play);
fu.get("/leave/", leave);
fu.get("/player-count/", player_count);

