var sys = require("sys"),
    players = [],
    player_counter = 0;

exports.default_404 = function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Nothing here...!');
    res.end();
};

exports.player_count = function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({players: players.length}));
    res.end();
};

exports.join = function(req, res) {
    player_counter++;
    players.push(player_counter);
    sys.puts(JSON.stringify(players));
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"id": player_counter, players: players.length}));
    res.end();
    
}

exports.leave = function(req, res) {

}