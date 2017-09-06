//create and append canvas element
var canvas = document.getElementById("canvasA");
var playerImage = document.getElementById("arrow");
var ctx = canvas.getContext("2d");
// canvas.width = parseInt(window.innerWidth * 0.86);
// canvas.height = parseInt(window.innerHeight * 0.86);
canvas.width = 800;
canvas.height = 650;
var center = [canvas.width/2, canvas.height/2];
var innerCircleWidth = canvas.width / 20;
var orbits = [0, 60, 120, 180, 240];

var playerImageReady = false;
playerImage.onload = function(){
  playerImageReady = true;
};

addEventListener("keydown", function (e) {
  e.stopPropagation();
  if (e.keyCode === 38 || e.keyCode === 87) {
    //up arrow or 'w'
    if (playerObject.orbit > 0){
      playerObject.orbit --;
    }
  }
  if (e.keyCode === 40 || e.keyCode === 83) {
    //down arrow
    if (playerObject.orbit < 4){
      playerObject.orbit ++;
    }
  }
  if (e.keyCode === 37 || e.keyCode === 65) {
    //left
    playerObject.degree += (.4 - (playerObject.orbit * .05));
  }
  if (e.keyCode === 39 || e.keyCode === 68) {
    //right
    playerObject.degree -= (.4 - (playerObject.orbit * .05));
  }
}, false);


var playerObject = {
  orbit: 4,
  degree: 0,
  x: function (degree, playerOrbit) {
    //radius times the cosine of the degree
    return (
      (innerCircleWidth + orbits[playerOrbit]) * Math.cos(degree)
    );
  },
  y: function (degree, playerOrbit) {
    return (
      (innerCircleWidth + orbits[playerOrbit]) * Math.sin(degree)
    );
  },

};


addEventListener("keydown", function (e) {
  console.log(e);
}, false);

var update = function() {

};

var render = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.beginPath();
  //orbit paths
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[0], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[1], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[2], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[3], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[4], 0, 2 * Math.PI);
  ctx.stroke();

  if (playerImageReady){
    ctx.drawImage(playerImage,
      (center[0] + playerObject.x(playerObject.degree, playerObject.orbit) - 15),
      (center[1] + playerObject.y(playerObject.degree, playerObject.orbit) - 15),
       30 , 30);
  }
};

var mainLoop = function () {
  var now = Date.now();

  update();
  render();
  requestAnimationFrame(mainLoop);
};

mainLoop();

//
