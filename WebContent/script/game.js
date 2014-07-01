var playerId = 1001;
var x = 500;
var y = 500;
var speed = 10;
var bulletSpeed = 5;
var currentDirection = 38;
var health = 100;
var fieredBullets = 0;
var bulletOrderNumber = 0;
var players = [];

$(document).ready(function() {
	drawPlayer();
	positionPlayer();
	var socket = new SockJS("/InvalidGame/myHandler");
	
	//STUB PLAYER
	setupStubPlayer();	
});

$(document).keypress(function(event){
	var code = event.keyCode || event.which;
	if(code == 32){
		fire();
	}
});

$(document).keydown(function(event){
	var code = event.keyCode || event.which;
	if(code == 32){
		return;
	}
	if(currentDirection != code){
		currentDirection = code;
		setDirection();
	}
	move(code);
});

function drawPlayer() {
	$("#main-player-div").append("<img id='main-player' class='character' src='img/player-up.png'></img>");
//	$("#main-player-div").attr("<span id='player"+playerId+"x' hidden='true'></span>");
//	$("#main-player-div").append("<span id='player"+playerId+"y' hidden='true'></span>");
	players.push($("#main-player-div"));
}

function positionPlayer() {
	$("#main-player-div").css("left", x + "px");
	$("#main-player-div").css("top", y + "px");
//	$("#player"+playerId+"x").html(x+"");
//	$("#player"+playerId+"y").html(y+"");
	$("#main-player-div").attr("x", x);
	$("#main-player-div").attr("y", y);
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
	positionPlayer();
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
	
}
