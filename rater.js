var PORT = 8000,
    HOST = "localhost",
    fu = require("./fu"),
    sys = require("sys"),
    players = [],
    player_counter = 0,
    player_callbacks = [];

var player_count = function(req, res) {
    sys.puts("Players: " + JSON.stringify(players));
    var callback = function() {
	    res.simpleJSON(200, {players: players.length});
    };
    player_callbacks.push(callback);
};

var join = function(req, res) {
    player_counter++;
    players.push(player_counter);
    sys.puts("Player " + player_counter + " joined.");
    sys.puts("Listeners: " + JSON.stringify(player_callbacks));
    for(i=0; i<player_callbacks.length; i++) player_callbacks[i]();
    player_callbacks = [];
    res.simpleJSON(200, {"id": player_counter, players: players.length});
}

var leave = function(req, res) {
    res.simpleJSON(200, {});
}


fu.listen(PORT, HOST);
fu.get("/about/", fu.staticHandler("static/about.html"));
fu.get("/", fu.staticHandler("static/index.html"));
fu.get("/static/cr.css", fu.staticHandler("static/cr.css"));
fu.get("/static/cr.js", fu.staticHandler("static/cr.js"));
fu.get("/join/", join);
fu.get("/leave/", leave);
fu.get("/player-count/", player_count);

