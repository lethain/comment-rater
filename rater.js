var http = require("http"),
    fu = require("./fu"),
    views = require("./views"),
    urlpattern = require("../workframe.js/urlpattern");

urlpattern.default_404 = views.default_404;   
urlpattern.patterns = [
		       //[/^\/project\/view\/([\w-_]+)\/$/, views.view_project],
		       //[/^\/static\//, views.static_files],
		       [/^\/static\/cr.css$/, fu.staticHandler("static/cr.css")],
		       [/^\/static\/cr.js$/, fu.staticHandler("static/cr.js")],
		       [/^\/player-count\/$/, views.player_count],
		       [/^\/join\/$/, views.join],
		       [/^\/leave\/$/, views.leave],
		       [/^\/about\/$/, fu.staticHandler("static/about.html")],
		       [/^\/$/, fu.staticHandler("static/index.html")]
		       ];

http.createServer(function(req, res) {
	var data = "";
	req.addListener('data', function(chunk) {
		data += chunk;
	    });
	req.addListener('end', function() {
		urlpattern.dispatch(req, res, data);
	    });
    }).listen(8000);
