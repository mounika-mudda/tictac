var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
var Game = require(__dirname+'/Game.js');

var clients = [];
var cntr = 0;
var inc=0;
var rooms = [];
var playerNum = 0;

for(var j=0;j<20;j++)
{
    rooms[j] = 'room' + j;
}


app.get('/',function(req, res) 
{
	res.sendfile('mounika.html');
});

io.on('connection', function(socket) {
   clients.push(socket);
   console.log('a user connected');
   playerNum++;
   socket.emit('player-num',playerNum);
   if(playerNum == 2){
    playerNum = 0;
   }
   if(clients.length % 2 ==0)
   {  
      if(cntr < 20) 
      {
        var currentSocket = socket;
        clients[inc].join(rooms[cntr]);
        clients[inc+1].join(rooms[cntr]);
        var g1 = new Game(clients[inc],clients[inc+1],currentSocket,rooms[cntr],io);
        g1.initialize();
        inc = inc+2;
        cntr++;
    }
  }

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});