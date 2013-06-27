  //librerias
var express = require('express'),
    app = express()
  , http = require('http')
 
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  //array contenedor nicks
    nicknames = [];

server.listen(3000);
 //render html 
app.get('/', function (req, res) {
  //respuesta cachada
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    //datos recibidos desde cliente validacion
    //data es la respuesta del cliente, fn es el callback o retorno respuesta
  socket.on('nickname', function (data, fn) {
    //indexoff item si se encuentraun array ono si no esta se debuelbe valor -1
    if (nicknames.indexOf(data) != -1) { 
      fn(true);
    } else {
      //existente cacha data 
      fn(false);
      nicknames.push(data);
      socket.nickname = data;
      //pasa dTA POR SOCKET LLAMADA NICK ACTUALIZA NICKS
      io.sockets.emit('nicknames', nicknames);
    }
  });
  //MENSAJE CACHADO POR CLIENTE REDIRECK A CLIENTE VER ARRAY CLIENTE
  socket.on('user message', function (data) {
    io.sockets.emit('user message', { 
      nick: socket.nickname, 
      message: data 
    });
  });
  //SALIDA DE CLIENTE REFRESCO DE NICKS
  socket.on('disconnect', function () {
    if (!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
  });
});
