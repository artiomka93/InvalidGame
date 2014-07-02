var playerId = Math.floor(Math.random() * (2000 - 1) + 1);
var x = 500;
var y = 500;
var speed = 10;
var bulletSpeed = 5;
var currentDirection = 38;
var health = 100;
var fieredBullets = 0;
var bulletOrderNumber = 0;
var players = [];

var stompClient = null;

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('response').innerHTML = '';
}

function connect() {
    var socket = new SockJS('http://10.23.12.148:8080/InvalidGame/hello');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function(msg){
        	positionPlayers(JSON.parse(msg.body));
           // showGreeting(JSON.parse(msg.body));
        });
        stompClient.subscribe('/topic/fiered', function(msg){
        	fireBullet(JSON.parse(msg.body));
        });
    });
}

function disconnect() {
    stompClient.disconnect();
    setConnected(false);
    console.log("Disconnected");
}

function sendCoords() {
    stompClient.send("/app/move", {}, JSON.stringify({ 'playerId': playerId, 'x':x, 'y':y, 'direction': currentDirection }));
}

function sendBulletFire() {
	if(fieredBullets >= 5){
		return;
	}
	++fieredBullets;
	var bulletNum = ++bulletOrderNumber;
	var bulletId = "bullet-" + playerId + "-" + bulletNum;
    stompClient.send("/app/fire", {}, JSON.stringify({ 'bulletId': bulletId, 'x':x, 'y':y, 'direction': currentDirection }));
}

function showGreeting(message) {
    var response = document.getElementById('response');
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.appendChild(document.createTextNode(message.playerId));
    response.appendChild(p);
}

$(document).ready(function() {
	drawPlayer();
	positionPlayer();
	connect();
	//STUB PLAYER
	//setupStubPlayer();	
});

$(document).keypress(function(event){
	var code = event.keyCode || event.which;
	if(code == 32){
		sendBulletFire();
	}
});

$(document).keydown(function(event){
	var code = event.keyCode || event.which;
	if(code == 32){
		return;
	}
	if(currentDirection != code){
		currentDirection = code;
		//setDirection();
	}
	move(code);
});

function drawPlayer() {
	$("#" + playerId).append("<img class='character' src='img/player-up.png'></img>");
//	$("#main-player-div").attr("<span id='player"+playerId+"x' hidden='true'></span>");
//	$("#main-player-div").append("<span id='player"+playerId+"y' hidden='true'></span>");
	players.push($("#" + playerId));
}

function positionPlayer() {
	$("#" + playerId).css("left", x + "px");
	$("#" + playerId).css("top", y + "px");
//	$("#player"+playerId+"x").html(x+"");
//	$("#player"+playerId+"y").html(y+"");
	$("#" + playerId).attr("x", x);
	$("#" + playerId).attr("y", y);
}

function positionPlayers(msg) {
	var id = msg.playerId;
	var direction = parseInt(msg.direction);
	for (var i = 0; i < players.length; i++) {
		var cId = players[i].attr("id");
		if(id == cId){
			players[i].css("left", msg.x + "px");
			players[i].css("top", msg.y + "px");
			players[i].attr("x", msg.x);
			players[i].attr("y", msg.y);
			
			if(direction == 37){
				players[i].find("img").attr("src", "img/player-left.png");
			} else if(direction == 38){
				players[i].find("img").attr("src", "img/player-up.png");
			} else if(direction == 39){
				players[i].find("img").attr("src", "img/player-right.png");
			} else if(direction == 40){
				players[i].find("img").attr("src", "img/player-down.png");
			}
			
			return;
		}
	}
	
	$("#game-field").append("<div class='char-div' id=" + id + "></div>");
	$("#" + id).append("<img class='character' src='img/player-up.png'></img>");
	players.push($("#" + id));
	
}

function move(direction){
	if(direction == 37){
		if(x <= 0){
			return;
		}
		x -= speed;
	} else if(direction == 38){
		if(y <= 0){
			return;
		}
		y -= speed;
	} else if(direction == 39){
		if(x >= 1470){
			return;
		}
		x += speed;
	} else if(direction == 40){
		if(y >= 770){
			return;
		}
		y += speed;
	}
	sendCoords();
}

function fire(){
	if(fieredBullets >= 10){
		return;
	}
	++fieredBullets;
	if(bulletOrderNumber >= 10){
		bulletNum = 0;
	}
	var bulletNum = ++bulletOrderNumber;
	$("#game-field").append("<img id='bullet-" + playerId + "-" + bulletNum +"' class='bullet'></img>");
//	var bulletId = "bullet" + bulletNum;
	$("#bullet-" + playerId + "-" + bulletNum).attr("src", "img/bullet.png");
	$("#bullet-" + playerId + "-" + bulletNum).attr("direction", currentDirection);
	$("#bullet-" + playerId + "-" + bulletNum).css("position", "absolute");
	$("#bullet-" + playerId + "-" + bulletNum).css("left", (x + 10) + "px");
	$("#bullet-" + playerId + "-" + bulletNum).css("top", (y + 10) + "px");
	//var interval = setInterval("moveBullet("+ bulletNum +")", 100);
	var bulletStart = 15;
	var interval = setInterval(function(){
		var direction = parseInt($("#bullet-" + playerId + "-" + bulletNum).attr("direction"));
		var currX = parseInt($("#bullet-" + playerId + "-" + bulletNum).css("left").match(/\d+/)[0]);
		var currY = parseInt($("#bullet-" + playerId + "-" + bulletNum).css("top").match(/\d+/)[0]);
		if(currX <= 0 || currX >= 1490 || currY <= 0 || currY >= 790){
			$("#bullet-" + playerId + "-" + bulletNum).remove();
			--fieredBullets;
			clearInterval(interval);
		}
		if(direction == 37){
			currX -= (bulletSpeed + bulletStart);
		} else if(direction == 38){
			currY -= (bulletSpeed + bulletStart);
		} else if(direction == 39){
			currX += (bulletSpeed + bulletStart);
		} else if(direction == 40){
			currY += (bulletSpeed + bulletStart);
		}
		bulletStart = 0;
		if(checkIfHit(currX, currY)){
			$("#bullet-" + playerId + "-" + bulletNum).remove();
			--fieredBullets;
			clearInterval(interval);
		}
		$("#bullet-" + playerId + "-" + bulletNum).css("left", currX + "px");
		$("#bullet-" + playerId + "-" + bulletNum).css("top", currY + "px");
	}, 10);
	//return bulletId;
}



function fireBullet(msg){
	var bId = msg.bulletId;
	var bX = parseInt(msg.x);
	var bY = parseInt(msg.y);
	var bDirection = msg.direction;
	$("#game-field").append("<img id=" + bId +" class='bullet'></img>");
//	var bulletId = "bullet" + bulletNum;
	$("#" + bId).attr("src", "img/bullet.png");
	$("#" + bId).attr("direction", bDirection);
	$("#" + bId).css("position", "absolute");
	$("#" + bId).css("left", (bX + 10) + "px");
	$("#" + bId).css("top", (bY + 10) + "px");
	//var interval = setInterval("moveBullet("+ bulletNum +")", 100);
	var bulletStart = 15;
	var interval = setInterval(function(){
		var direction = parseInt($("#" + bId).attr("direction"));
		var currX = parseInt($("#" + bId).css("left").match(/\d+/)[0]);
		var currY = parseInt($("#" + bId).css("top").match(/\d+/)[0]);
		if(currX <= 0 || currX >= 1490 || currY <= 0 || currY >= 790){
			$("#" + bId).remove();
			if(bId.indexOf(playerId) != -1){
				--fieredBullets;
			}
			clearInterval(interval);
		}
		if(direction == 37){
			currX -= (bulletSpeed + bulletStart);
		} else if(direction == 38){
			currY -= (bulletSpeed + bulletStart);
		} else if(direction == 39){
			currX += (bulletSpeed + bulletStart);
		} else if(direction == 40){
			currY += (bulletSpeed + bulletStart);
		}
		bulletStart = 0;
		if(checkIfHit(currX, currY)){
			$("#" + bId).remove();
			if(bId.indexOf(playerId) != -1){
				--fieredBullets;
			}
			clearInterval(interval);
		}
		$("#" + bId).css("left", currX + "px");
		$("#" + bId).css("top", currY + "px");
	}, 10);
	//return bulletId;
}

function checkIfHit(bulletX, bulletY){
	for (var i = 0; i < players.length; i++) {
		var playerX = parseInt(players[i].attr("x"));
		var playerY = parseInt(players[i].attr("y"));
	    if((bulletX >= playerX) && (bulletX < (playerX + 30)) && (bulletY >= playerY) && (bulletY < (playerY + 30))){
	    	players[i].find("img").attr("src", "img/player-hit.png");
	    	setTimeout(setDirection, 100);
	    	return true;
	    }
	}
	return false;
}

function setDirection(){
	if(currentDirection == 37){
		$("#main-player").attr("src", "img/player-left.png");
	} else if(currentDirection == 38){
		$("#main-player").attr("src", "img/player-up.png");
	} else if(currentDirection == 39){
		$("#main-player").attr("src", "img/player-right.png");
	} else if(currentDirection == 40){
		$("#main-player").attr("src", "img/player-down.png");
	}
}




//------------------------------------------------------  OTHER PLAYER STUB
/*

function setupStubPlayer(){
	$("#game-field").append("<div id='player123'></div>");
	$("#player" + 123).append("<img id='player123img' class='character' src='img/player-down.png'></img>");
//	$("#player" + 123).append("<span id='player123x' hidden='true'>0</span>");
//	$("#player" + 123).append("<span id='player123y' hidden='true'>0</span>");
	$("#player" + 123).attr("x", 0);
	$("#player" + 123).attr("y", 0);
	players.push($("#player" + 123));
	
	setInterval(function fire(){
		var bulletNum = Math.floor((Math.random() * 1000) + 1);
		$("#game-field").append("<img id='bullet" + bulletNum +"' class='bullet'></img>");
		var bulletId = "bullet" + bulletNum;
		$("#" + bulletId).attr("src", "img/bullet.png");
		$("#" + bulletId).attr("direction", 40);
		$("#" + bulletId).css("position", "absolute");
		$("#" + bulletId).css("left", (0 + 10) + "px");
		$("#" + bulletId).css("top", (0 + 10) + "px");
		//var interval = setInterval("moveBullet("+ bulletNum +")", 100);
		var bulletStart = 15;
		var interval = setInterval(function(){
			var direction = parseInt($("#bullet" + bulletNum).attr("direction"));
			var currX = parseInt($("#bullet" + bulletNum).css("left").match(/\d+/)[0]);
			var currY = parseInt($("#bullet" + bulletNum).css("top").match(/\d+/)[0]);
			if(currX <= 0 || currX >= 1490 || currY <= 0 || currY >= 790){
				$("#bullet" + bulletNum).remove();
				clearInterval(interval);
			}
			if(direction == 37){
				currX -= (bulletSpeed + bulletStart);
			} else if(direction == 38){
				currY -= (bulletSpeed + bulletStart);
			} else if(direction == 39){
				currX += (bulletSpeed + bulletStart);
			} else if(direction == 40){
				currY += (bulletSpeed + bulletStart);
			}
			bulletStart = 0;
			if(checkIfHit(currX, currY)){
				$("#bullet" + bulletNum).remove();
				clearInterval(interval);
			}
			$("#bullet" + bulletNum).css("left", currX + "px");
			$("#bullet" + bulletNum).css("top", currY + "px");
		}, 10);
		//return bulletId;
	}, 700);
	
}*/
