var id = null,
    players = 0,
    game = null,
    comment_id = 0,
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
		$("#title").text("Starting new game... (" + game.duration + " seconds left)");
		$("#comment").replaceWith($("<div id='comment'><h2>Read this comment</h2><div id='comment-text'></div><h2>Pick a tag</h2><div id='comment-tags'></div><h2>Work together</h2><div id='history'></div></div>"));
		durationInterval = setInterval(function() {
			if (game.duration > 0) {
			    game.duration--;
			    $("#title").text("Playing... (" + game.duration + " seconds left)");
			} else {
			    clearInterval(durationInterval);
			    durationInterval = null;
			    $("#title").text("Out of time!");
			}
		    }, 1000);
		comment_id = 0;
		getComment(comment_id);
	    }});
    $("#title").text("Waiting for partner!");
    $("#comment").text("A partner is going to come wisk you away, in just a second... just a second... please? Someone? Anyone?");
};

function getComment(n) {
    $.ajax({type:"GET", url:"/comment/", dataType:"json",
		data:{ game_id:game.id, question_id:n},
		error: function() { setTimeout(function() { getComment(n); }, 1000) },
		success: function(data) {
		$("#comment-text").replaceWith($("<div id='comment-text'><p>" + data.question.comment + "</p></div>"));
		var tags = "<div id='comment-tags'>";
		for (i=0; i<data.question.tags.length; i++) {
		    tags += "<span><a href=\""+data.question.tags[i]+"\">" + data.question.tags[i] + "</a></span>";
		}
		tags += "</div>";
		$("#comment-tags").replaceWith($(tags));
		$("a", "#comment-tags").click(function(event) {
			event.preventDefault();
			var parts = this.href.split("/");
			var answer = parts[parts.length-1];
			$.ajax({cache: false, type:"GET", url:"/comment/", dataType:"json",
			       data:{ game_id:game.id, question_id:n, answer:answer },
			       success: function(data) {
				    var s = "<p>Answers for Comment " + n + " were ";
				    for(i=0; i<data.answers.length; i++) {
					if (i > 0) s += ", ";
					s += data.answers[i];
				    }
				    if (data.score != game.score) {
					s += ". <b>Score is " + data.score + "!</b>";
				    }
				    game.score = data.score;
				    s += "</p>";
				    $("#history").prepend($(s));
				   getComment(n+1);
				}})});
	    }})};

function endGame() {
    $.ajax({cache: false, type:"GET", url:"/finish/", dataType:"json",
		data:{game_id:game.id},
		error: function() { setTimeout(endGame, 5*1000); },
		success: function(data) {
		if (data.final_score !== null) {
		    $("#title").text("Final Score was " + data.final_score);
		} else {
		    $("#title").text("We couldn't calculate your final score. We suck. Epic fail. Sorry :-(");
		}
		$("#comment").replaceWith($("<div id=\"comment\"><a href=\"#\" id=\"play\">Play again? (We highly encourage it, but it isn't exactly required...)</a></p></div>"));
		$("#play").click(playGame);
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


