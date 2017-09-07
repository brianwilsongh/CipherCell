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
var life;


addEventListener("keydown", function (e) {
  e.stopPropagation();
  if (e.keyCode === 38 || e.keyCode === 87) {
    //up arrow or 'w'
    if (playerObject.orbit > 0){
      if (!checkCollisionAgainstBlocker(playerObject.orbit - 1)){
        //no collision by decrease orbit
        playerObject.orbit --;
      }
    }
  }
  if (e.keyCode === 40 || e.keyCode === 83) {
    //down arrow
    if (playerObject.orbit < 4){
      if (!checkCollisionAgainstBlocker(playerObject.orbit + 1)){
        //no collision by increase orbit
        playerObject.orbit ++;
      }
    }
  }
  if (e.keyCode === 37 || e.keyCode === 65) {
    //left
    var intendedRadianChange = (.15 - (playerObject.orbit * .02));

    if (playerObject.orbit === orbits.length - 1){
      //if player is in top orbit, don't check collision
      playerObject.radian += intendedRadianChange;
      console.log("top orbit");
    } else {
      if (!checkCollisionAgainstBlocker(playerObject.orbit, intendedRadianChange)){
        playerObject.radian += intendedRadianChange;
      }
    }
  }
  if (e.keyCode === 39 || e.keyCode === 68) {
    //right
    var intendedRadianChange = -(.15 - (playerObject.orbit * .02));
    if (playerObject.orbit === orbits.length - 1){
      //if player is in top orbit, don't check collision
      playerObject.radian += intendedRadianChange;
    } else {
      if (!checkCollisionAgainstBlocker(playerObject.orbit, intendedRadianChange)){
        playerObject.radian += intendedRadianChange;
      }
    }
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
  var killers = 0;
  var startArcsInOrbit = {
    1: [],
    2: [],
    3: [],
    4: []
  };
  while (killers < number){
    for (var orbit = 1; orbit < 5; orbit++){
      //iterate through the orbits
      if (killers < number){
        //if there aren't enough killers
        var randomStartArc = parseInt(Math.random() * 6) + 1;
        //generate random start arc, insert if position not used
        if (startArcsInOrbit[orbit].indexOf(randomStartArc) === -1){
          //if this start arc was not used in this orbit
          startArcsInOrbit[orbit].push(randomStartArc);
          itemsOfOrbit[orbit].push(
            {type: "killer", startArc: randomStartArc}
          );
          console.log("push randomStartArc", randomStartArc, "to orbital", orbit);
          killers += 1;
        }
      }
    }

  }

};
buildKillers(10);
console.log(itemsOfOrbit);

var buildBlockers = function (number){
  for (var itr = 0; itr < number; itr++){
    itemsOfOrbit[parseInt(Math.random() * 4) + 1].push(
      //three blockers per orbit max, each with arc of pi/6 radians
      {type: "blocker", startArc: parseInt(Math.random() * 3) + 1}
    );
  }
};
buildBlockers(4);

var checkCollisionAgainstBlocker = function (orbit, intendedRadianChange=0){
  var collisionDetected = false;
  var collisionMargin = (Math.PI/96); //prevents player icon from appearing inside blocker
  itemsOfOrbit[orbit].forEach((blocker) => {
    var playerHorizRad = ((Math.PI*2) - ((Math.PI*2 + ((playerObject.radian + intendedRadianChange) % (Math.PI * 2)))%(Math.PI*2)));
    var blockerHorizRad = ((Math.PI*2) - blocker.startArc);
    //remember blockers are rendered clockwise
    if (blocker.type === "blocker"){
      if (blockerHorizRad <= Math.PI/6){
        //if blocker is at the overlap
        if (playerHorizRad <= (blockerHorizRad + collisionMargin)
          || playerHorizRad >= Math.PI*2 - (Math.PI/6 - blockerHorizRad - collisionMargin) ){
            collisionDetected = true;
          }
      } else if (playerHorizRad <= (blockerHorizRad + collisionMargin)
          && playerHorizRad >= ((blockerHorizRad - Math.PI/6) - collisionMargin)){
            collisionDetected = true;
          }
    }
  });
  return collisionDetected;
};

var checkPlayerInsideKiller = function (){
  if (playerObject.orbit < 5){
    itemsOfOrbit[playerObject.orbit].forEach((killer) => {
      var playerHorizRad = ((Math.PI*2) - ((Math.PI*2 + (playerObject.radian % (Math.PI * 2)))%(Math.PI*2)));
      var killerHorizRad = ((Math.PI*2) - killer.startArc);
      //remember killers are rendered clockwise
      if (killer.type !== "killer"){
        return false;
      }

      if (killerHorizRad <= Math.PI/6){
        //if killer is at the overlap
        if (playerHorizRad <= killerHorizRad
          || playerHorizRad >= Math.PI*2 - (Math.PI/6 - killerHorizRad) ){
            playerKilled();
            return true;
        }
      } else if (playerHorizRad <= killerHorizRad
        && playerHorizRad >= killerHorizRad - Math.PI/6){
          playerKilled();
          return true;
      }
    });
  }
  return false;
};

var playerKilled = function () {
  console.log("Zed is dead baby. Zed is dead.");
};

var update = function() {
  Object.keys(itemsOfOrbit).forEach((key) => {
    itemsOfOrbit[key].forEach((item) => {
      if (item.startArc >= 2 * Math.PI){
        item.startArc = 0;
      }
      if (item.type === "killer"){
        item.startArc += 0.01;
      }
    });
  });
  checkPlayerInsideKiller();
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


  ctx.lineWidth = 17;
  ctx.lineCap = "square";
  //draw the objects in each orbit
  Object.keys(itemsOfOrbit).forEach((orbitKey) => {
    itemsOfOrbit[orbitKey].forEach((item) => {
      ctx.beginPath();
      if (item.type === "killer"){
        ctx.strokeStyle = "#FF0000";
        ctx.arc(center[0], center[1], innerCircleWidth + orbits[orbitKey], item.startArc, item.startArc + Math.PI/6);
      } else {
        ctx.strokeStyle = "orange";
        ctx.arc(center[0], center[1], innerCircleWidth + orbits[orbitKey], item.startArc, item.startArc + Math.PI/6);
      }
      ctx.stroke();
      ctx.closePath();
    });
  });

};

var mainLoop = function () {
  var now = Date.now();
  life = 1000;
  update();
  render();
  requestAnimationFrame(mainLoop);
};

mainLoop();

//
