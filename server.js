'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var strftime = require("strftime");
var session = require('express-session');
var moment = require("moment");

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.get('/:date', function(req, res) {
	if (/^\d{8,}$/.test(req.params.date)) {
		var date = moment(req.params.date, "X");
		
	}
	else {
		var date = moment(req.params.date, "MMMM D YYYY");
	}
	if (date.isValid()) {
		res.send({
			"unix": date.format("X"),
			"natural": date.format("MMMM D, YYYY")
		});
		
	}
	else {
		res.send({
			"unix": null,
			"natural": null
		});
	}
});

app.get('/', function(req, res) {
	res.send("This is the homepage!");
})

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});