var id = null,
    players = 0,
    game = null,
    durationInterval = null;

function longPollForPlayerCount() {
    $.ajax({cache: false, type:"GET", url:"/player-count/", dataType:"json",
		data:{ players:players, id:id},
		error: function() {
		setTimeout(longPollForPlayerCount, 10*1000);
	    },
		success: function(data) {
		if (data) {
		    players = data.players;
		    $("#playerCount").text(players + " people rating Digg comments!");
		}
		longPollForPlayerCount();
	    }})};
function playGame(event) {
    event.preventDefault();
    $.ajax({cache: false, type:"GET", url:"/play/", dataType:"json",
		data:{ id: id},
		error: function() { setTimeout(playGame, 10*2500); },
		success: function(data) {
		game = data.game;
		endGame();
		$("h2").text("Starting new game... (" + game.duration + " seconds left)");
		durationInterval = setInterval(function() {
			if (game.duration > 0) {
			    game.duration--;
			    $("h2").text("Playing... (" + game.duration + " seconds left)");
			} else {
			    clearInterval(durationInterval);
			    durationInterval = null;
			    $("h2").text("Out of time!");
			}
		    }, 1000);
	    }})};

function endGame() {
    $.ajax({cache: false, type:"GET", url:"/finish/", dataType:"json",
		data:{game_id:game.id},
		error: function() { setTimeout(endGame, 5*1000); },
		success: function(data) {
		if (data.final_score !== null) {
		    $("h2").text("Final Score was " + data.final_score);
		} else {
		    $("h2").text("We couldn't calculate your final score. We suck. Epic fail. Sorry :-(");
		}
		$("#comment").replaceWith($("<div id=\"comment\"><a href=\"#\" id=\"play\">Play again? (We highly encourage it, but it isn't exactly required...)</a></p></div>")).click(playGame);
		if (durationInterval) {
		    clearInterval(durationInterval);
		    durationInterval = null;
		}
	    }})};

$(document).ready(function() {
	$(window).unload(function () {
		jQuery.get("/leave/", {id: id}, function (data) { alert("leaving"); }, "json");
	    });
	jQuery.get("/join/", {}, function (data) { 
		id = data.id;
		players = data.players;
		$("#playerCount").text(players + " people rating Digg comments!");	       
		longPollForPlayerCount();
	    }, "json");
	$("#play").click(playGame);
    });


