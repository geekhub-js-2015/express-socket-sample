'use strict';

const express = require('express'),
    exphbs = require('express-handlebars'),
    session = require('express-session'),
    browserify = require('browserify-middleware'),
    babelify = require('babelify'),
    socketIo = require('socket.io'),
    expressLess = require('express-less'),
    hbsfy = require('hbsfy');

let app = express(),
    server = require('http').Server(app);

let io = socketIo(server);

let socketWrap = (mid) => (socket, next) => mid(socket.request, socket.request.res, next);
let sessionMid = session({
    secret: '8W92p90pv7pw3KtlqeSohHj4gX8r9c',
    resave: false,
    saveUninitialized: true
});
app.use(sessionMid);
io.use(socketWrap(sessionMid));

let hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    layoutsDir: __dirname + '/views/layouts/'
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
//app.enable('view cache');

let shared = ['babel-polyfill', 'socket.io-client'];
app.get('/js/bundle.js', browserify(shared));
app.use('/js', browserify(__dirname + '/public/js', {
    external: shared,
    transform: [
        [babelify, {presets: ['es2015']}],
        [hbsfy]
    ]
}));

app.use('/css', expressLess(__dirname + '/public/less'));

let messages = [];

app.get('/', (req, res) => {
    res.render('index', {messages});
});

io.of('/messages').on('connection', (socket) => {
    socket.on('/new', function (data) {
        messages.push(data);
        socket.broadcast.emit('/message', data);
    });
});

server.listen(3000);
