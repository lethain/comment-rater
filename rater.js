var PORT = 8000,
    HOST = "localhost",
    SESSION_TIMEOUT = 60 * 1000,
    fu = require("./fu"),
    sys = require("sys"),
    qs = require("querystring"),
    url = require("url"),
    players = [],
    player_counter = 0,
    game_counter = 0,
    games = {},
    waiting_callbacks = [], // waiting for new game, have already clicked "start playing"
    player_callbacks = []; // listening for changes to number of players playing

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

var make_game = function(player1, player2) {
    game_counter++;
    sys.puts("Starting game " + game_counter);
    sys.puts(JSON.stringify(player1));
    sys.puts(JSON.stringify(player2));
    var g  = {
	id: game_counter,
	start: new Date(),
	duration: 5,
	score: 0,
	questions: [],
	players: [player1.player, player2.player],
    };
    games[g.id] = g;
    player1.func(g, player2.player);
    player2.func(g, player1.player);
    g.gameover_callbacks = [];
    g.timer = setTimeout(function() {
	    sys.puts("Game " + g.id + " over!");
	    g.gameover_callbacks.forEach(function(obj) {
		    sys.puts("gameover_callback!");
		    obj();
		});
	}, g.duration * 1000);

};

var make_comment = function() {
    return { comment:"This is a random comment...",
	    tags:["Smart", "Funny", "Inappropriate", "Incoherent", "Quirky"]};
}

var comment = function(req, res) {
    var game_id = qs.parse(url.parse(req.url).query).game_id;
    var question_id = qs.parse(url.parse(req.url).query).question_id;
    var g = games[game_id];
    var q;
    if (g.questions[question_id]) q = g.questions[question_id];
    else {
	q = make_comment();
	g.questions[question_id] = q;
    }
    res.simpleJSON(200, {game_id: game_id, question_id: question_id, question:q});
       
};
	
var finish = function(req, res) {
    var game_id = qs.parse(url.parse(req.url).query).game_id;
    var g = games[game_id];
    g.gameover_callbacks.push(function() {
	    res.simpleJSON(200, {id: game_id, final_score:g.score});
	});
}

var play = function(req, res) {
    var player1_id = qs.parse(url.parse(req.url).query).id;
    sys.puts("Player " + player1_id + " ready to play");
    var cb = function(game, partner_id) {
	res.simpleJSON(200, {id: player1_id,  partner: partner_id, game: game});
    }
    var callback1 = { player: player1_id, func: cb};
    if (waiting_callbacks.length > 0)
	make_game(callback1, waiting_callbacks.pop());
    else
	waiting_callbacks.push(callback1);
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
fu.get("/comment/", comment);
fu.get("/play/", play);
fu.get("/finish/", finish);
fu.get("/leave/", leave);
fu.get("/player-count/", player_count);

