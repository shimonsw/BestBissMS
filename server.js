﻿var express    = require("express");
var app        = express();
var server     = require('http').createServer(app);
var io         = require('socket.io').listen(server);
var path       = require('path');
var bodyParser = require('body-parser');

io.use(function(socket, next) {
    var handshake = socket.request;

    if (!handshake) {
        return next(new Error('[[error:not-authorized]]'));
    }

    cookieParser(handshake, {}, function(err) {
        if (err) {
            return next(err);
        }

        var sessionID = handshake.signedCookies['express.sid'];

        db.sessionStore.get(sessionID, function(err, sessionData) {
            if (err) {
                return next(err);
            }
            console.log(sessionData);

            next();
        });
    });
});

// socket.io
io.sockets.on('connection', function(socket){

	socket.on('communicate', function(info){
		var socket_id = socket.id;
		io.emit('new-order-arrived', info);
	});

});

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
app.use(require('./mobile_routers'));
app.use(require('./mysql'));
app.use(require('./functions'));
app.use(require('./mobile_functions'));

app.post('/credit-success-page', function(req, res){
	console.log('heeere');
	io.emit('credit-success');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log("app http ready on port "+port);
});