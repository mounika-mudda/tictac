function Game(socket1,socket2,curr,roomnumber,io){
	var winCombo = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
	var sockets = [];
	var n;
	var filled = [];
	var data = [];
	var turn = 0;
	var no_of_filled = 0;

	for(var i=0; i<=8; i++)
    {
        filled[i] = false;
        data[i] = '';
    }

	sockets.push(socket1,socket2);
  var current = this;

  this.initialize = function(){
    io.to(roomnumber).emit('game-started');
    for(var i=0;i<2;i++)
    {
       sockets[i].on('myClick',function(id) {
       current.playGame(id,this);
       });
    }
   };


   this.playGame = function(id,curr_socket){
     	var currSocket = curr_socket;
     	var changed = false;
      n = id.charAt('1');
      var disp_img;
      var tmsg1 = "It's other player's turn!";
  	  var tmsg2 = "It's your turn!";
      var tmsg3 = "That place is already occupied..try a different place.";
      var tmsg4 = "";

	if((turn%2 == 0) && (currSocket == sockets[0])){
	  if(!(filled[n])){
	  	disp_img = "url(http://www.my-favorite-coloring.net/Images/Large/Numbers-and-shapes-Alphabet-Letter-x-126719.png)";
     // io.to(roomnumber).emit('event-x',id,disp-img);
	    
      data[n] = 'x';
      changed = true;
	  }
	  else
      {
	       currSocket.emit('warn-msg',tmsg3);
       }
	}

	else if(!((turn % 2) == 0) && (currSocket == sockets[1])) {
		if(!(filled[n])){
        	disp_img = "url(http://lettergenerator.net/alphabetletters/cool/printable-letter-thecool-o.jpg)";
          data[n] = 'o';
          changed = true;
	    }
	    else
        {
          currSocket.emit('warn-msg',tmsg3);
        }
	}
  else
  {
    currSocket.emit('warn-msg',tmsg1);
  }

	if(changed == true)
        {
            io.to(roomnumber).emit('display-img',id,disp_img);
            filled[n] = true;
            turn++;
            no_of_filled++;
            currSocket.emit('warn-msg',tmsg4);
            currSocket = (currSocket == sockets[0]) ? sockets[1] : sockets[0];
            currSocket.emit('warn-msg',tmsg2);
            current.checkWin(data[n]);
            if(no_of_filled == 9)
            {
                var alert_msg2 = "GAME OVER";
                io.to(roomnumber).emit('gameover',alert_msg2);
            } 
        }
};



this.checkWin = function(sym,rumno){
        for(var i in winCombo)
        {
        if(data[winCombo[i][0]] == sym && data[winCombo[i][1]] == sym && data[winCombo[i][2]] == sym)
         {
            player = sym == 'x' ? "1" : "2";
            current.playAgain(player);
        }
        }
    };

 this.playAgain = function(player){
   
        io.to(roomnumber).emit('play-again',player);
 };


}

module.exports = Game;
