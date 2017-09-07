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
var orbits = [0, 50, 100, 150, 200, 250];


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
    playerObject.radian += (.3 - (playerObject.orbit * .04));
  }
  if (e.keyCode === 39 || e.keyCode === 68) {
    //right
    playerObject.radian -= (.3 - (playerObject.orbit * .04));
  }
}, false);


var playerObject = {
  orbit: 5,
  radian: Math.PI/2,
  //CLOCKWISE starting from 0
  x: function (radian, playerOrbit) {
    //radius times the cosine of the radian
    return (
      (innerCircleWidth + orbits[playerOrbit]) * Math.cos(radian)
    );
  },
  y: function (radian, playerOrbit) {
    return (
      (innerCircleWidth + orbits[playerOrbit]) * Math.sin(radian)
    );
  },

};

var itemsOfOrbit = {
  //does not include the player object
  0: [],
  1: [],
  2: [],
  3: [],
  4: []
};

var buildKillers = function (number){
  //build killers number times
  for (var itr = 0; itr < number; itr++){
    itemsOfOrbit[parseInt(Math.random() * 4) + 1].push(
      //six killers per orbit max, each with arc of pi/6 radians
      {killer: itr, startArc: parseInt(Math.random() * 6) + 1}
    );
  }
};
buildKillers(2);

var playerInsideKiller = function (){
  if (playerObject.orbit < 5){
    itemsOfOrbit[playerObject.orbit].forEach((killer) => {
      var playerHorizRad = ((Math.PI*2) - ((Math.PI*2 + (playerObject.radian % (Math.PI * 2)))%(Math.PI*2)));
      var killerHorizRad = ((Math.PI*2) - killer.startArc);
      //remember killers are rendered counterclockwise
      if (playerHorizRad <= killerHorizRad
        && playerHorizRad >= killerHorizRad - Math.PI/6){
          console.log("touch");
          return true;
      }
    });
  }
  return false;
};

var update = function() {
  Object.keys(itemsOfOrbit).forEach((key) => {
    itemsOfOrbit[key].forEach((killer) => {
      if (killer.startArc >= 2 * Math.PI){
        killer.startArc = 0;
      }
      killer.startArc += 0.005;
    });
  });
  if (playerInsideKiller()){
    console.log("Touching!");
  }
};

var positionWithinKillerArc = function(pos, killerStartArc){

};

var render = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  //orbit paths
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[0], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[1], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[2], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[3], 0, 2 * Math.PI);
  ctx.arc(center[0], center[1], innerCircleWidth + orbits[4], 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  var playerPosX = center[0] + playerObject.x(playerObject.radian, playerObject.orbit) - 15;
  var playerPosY = center[1] + playerObject.y(playerObject.radian, playerObject.orbit) - 15;

  var angle = Math.atan2(playerPosY + 15 - center[1], playerPosX + 15 - center[0]) - Math.PI / 2;

  ctx.save();
  ctx.translate(playerPosX + 15, playerPosY + 15);
  ctx.rotate(Math.PI/6 + angle);
  ctx.drawImage(playerImage, -15, -15, 30 , 30);
  ctx.restore();


  ctx.lineWidth = 15;
  ctx.strokeStyle = "#FF0000";
  ctx.lineCap = "square";
  //draw the objects in each orbit
  Object.keys(itemsOfOrbit).forEach((orbitKey) => {
    itemsOfOrbit[orbitKey].forEach((killer) => {
      ctx.beginPath();
      ctx.arc(center[0], center[1], innerCircleWidth + orbits[orbitKey], killer.startArc, killer.startArc + Math.PI/6);
      ctx.stroke();
      ctx.closePath();
    });
  });

};

var mainLoop = function () {
  var now = Date.now();

  update();
  render();
  requestAnimationFrame(mainLoop);
};

mainLoop();

//
