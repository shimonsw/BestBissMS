﻿var express    = require("express");
var http       = require('http');
var path       = require('path');
var bodyParser = require('body-parser');
var app        = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'includes')));
app.use(bodyParser.urlencoded({ extended: false }));

// define routes

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	next();
});

app.use(require('./routers'));
app.use(require('./mysql'));
app.use(require('./functions'));

// start the server

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function(){
	console.log("app http ready on port "+port);
});