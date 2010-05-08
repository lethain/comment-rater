var id = null;
var players = 0;


function longPollForPlayerCount() {
    $.ajax({cache: false, type:"GET", url:"/player-count/", dataType:"json",
		data:{ players:players, id:id},
		error: function() {
		console.log(error);
		setTimeout(longPollForPlayerCount, 10*1000);
	    },
		success: function(data) {
		console.log(data);
		players = data.players;
		$("#playerCount").text(players + " people rating Digg comments!");
		longPollForPlayerCount();
	    }})};

$(document).ready(function() {
	jQuery.get("/join/", {}, function (data) { 
		id = data.id;
		players = data.players;
		longPollForPlayerCount();
	    }, "json");
    });

$(window).unload(function () {
	jQuery.get("/leave/", {id: id}, function (data) { }, "json");
    });
