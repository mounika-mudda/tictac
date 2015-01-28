var socket = io();
    var playerNum;

    function byName(name)
       {
    return document.getElementsByName(name);
    }

    function element(id)
    {
    return document.getElementById(id);
    }

    function addLisN(name,type,func)
    {
    var arr = byName(name);
    for( var i in arr)
    {
      arr[i].addEventListener(type,func); 
    }
    }

window.onload = function () {
   var inc = 0;
   for(var i=0;i<3;i++)
   {
    var row = document.createElement('tr');
    element('tictactoe').appendChild(row);
    for (var j = 0; j<3; j++) {
        var col = document.createElement('td');
        col.setAttribute('id','c'+inc);
        col.setAttribute('name','cell');
        inc++;
        row.appendChild(col);
    }   
   }
   addLisN("cell","click",clicked);
}

socket.on('player-num',function(num){
   playerNum = num;
   element('player_num').innerHTML = "player " + num;
});

socket.on('game-started',function(){
    if(playerNum == 1){
        element("display-msg").innerHTML = "The other player has joined.You can start playing now";
    }
    else
    {
        element("display-msg").innerHTML = "You can start playing now";
    }
});

function clicked()
{
    socket.emit('myClick',this.id);
}

socket.on('display-img',function(id,imagex){
     element(id).style.backgroundSize = "80px 80px";
     element(id).style.backgroundRepeat = "no-repeat";
     element(id).style.backgroundPosition = "center";
     element(id).style.backgroundImage = imagex;
});

socket.on('warn-msg',function(tmsg1){
         element("display-msg").innerHTML = tmsg1;
 });

socket.on('gameover',function(amsg2){
     element("display-msg").innerHTML = amsg2;
     var y = confirm("Game over-do you want to play again?");
     if(y == true)
     {
      location.reload(true);
     }
}); 

socket.on('play-again',function(player){
  element("display-msg").innerHTML = "Player " + player + " won";
  playAgain();
}); 

function playAgain()
{
    var playagn_btn = document.createElement("button");
    var text = document.createTextNode("Play again");
    playagn_btn.appendChild(text);
    playagn_btn.setAttribute('id','playAgain_btn');
    element('display-msg').appendChild(playagn_btn);
    element('playAgain_btn').addEventListener('click',reload);
}

function reload()
{
    location.reload();
}




    