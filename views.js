var sys = require("sys"),
    players = [],
    player_counter = 0,
    player_listeners = [];

exports.player_count = function(req, res) {
    sys.puts("Subscribing for player count...");
    player_listers.push(res);    
};

exports.join = function(req, res) {
    player_counter++;
    players.push(player_counter);
    sys.puts("Player " + player_counter + " joined.");
    sys.puts("Listeners: " + JSON.stringify(players));
    for (i=0; i<player_listeners.length; i++)
	player_listeners[i].simpleJSON(200, {players: players.length});
    player_listeners = [];
    res.simpleJSON(200, {"id": player_counter, players: players.length});    
}

exports.leave = function(req, res) {
    res.simpleJSON(200, {});
}