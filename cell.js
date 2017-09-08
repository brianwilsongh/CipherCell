var enterMatrix = require("./matrix.js");
enterMatrix();

window.onload = function (){

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
  var time;


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
    var startArcsInOrbit = { 1: [], 2: [], 3: [], 4: []};
    while (killers < number){
      for (var orbit = 1; orbit < 5; orbit++){
        if (killers < number){
          var randomStartArc = parseInt(Math.random() * 6) + 1;
          if (startArcsInOrbit[orbit].indexOf(randomStartArc) === -1){
            //if this start arc was not used in this orbit...
            startArcsInOrbit[orbit].push(randomStartArc);
            itemsOfOrbit[orbit].push({type: "killer", startArc: randomStartArc});
            killers += 1;
          }
        }
      }
    }
  };
  var buildBlockers = function (number){
    var blockers = 0;
    var startArcsInOrbit = { 1: [], 2: [], 3: [], 4: []};
    while (blockers < number){
      for (var orbit = 1; orbit < 5; orbit++){
        if (blockers < number){
          var randomStartArc = parseInt(Math.random() * 6) + 1;
          if (startArcsInOrbit[orbit].indexOf(randomStartArc) === -1){
            //if this start arc was not used in this orbit...
            startArcsInOrbit[orbit].push(randomStartArc);
            itemsOfOrbit[orbit].push({type: "blocker", startArc: randomStartArc});
            blockers += 1;
          }
        }
      }
    }
  };
  var rotateOrbitItems = function () {
    Object.keys(itemsOfOrbit).forEach((orbit) => {
      itemsOfOrbit[orbit].forEach((item) => {
        if (Math.random() > 0.5){
          item.startArc += (Math.random() * Math.PI/7);
        } else {
          item.startArc -= (Math.random() * Math.PI/7);
        }
      });
    });
  };

  buildKillers(20);
  buildBlockers(20);
  rotateOrbitItems();

  var checkCollisionAgainstBlocker = function (orbit, intendedRadianChange=0){
    var collisionDetected = false;
    var collisionMarginOrbitRatio = (innerCircleWidth + 50) / innerCircleWidth;
    var collisionMargin = (Math.PI/96) + Math.pow(collisionMarginOrbitRatio, (4 - orbit))
     * (Math.PI/394); //prevents player icon from appearing inside blocker
    itemsOfOrbit[orbit].forEach((blocker) => {
      var playerHorizRad = ((Math.PI*2) - ((Math.PI*2 + ((playerObject.radian + intendedRadianChange) % (Math.PI * 2)))%(Math.PI*2)));
      var blockerHorizRad = ((Math.PI*2) - blocker.startArc);
      //remember blockers are rendered clockwise
      if (blocker.type === "blocker"){
        if (blockerHorizRad <= Math.PI/6){
          //if blocker is at the overlap
          if (playerHorizRad <= (blockerHorizRad + collisionMargin)
            || playerHorizRad >= Math.PI*2 - (Math.PI/6 - blockerHorizRad + collisionMargin) ){
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
              playerHit();
              return true;
          }
        } else if (playerHorizRad <= killerHorizRad
          && playerHorizRad >= killerHorizRad - Math.PI/6){
            playerHit();
            return true;
        }
      });
    }
    return false;
  };

  var playerHit = function () {
    life -= 0.3;
    window.playerDamaged = true;
    document.getElementById("matrix").classList.remove("matrixRegular");
    document.getElementById("matrix").classList.add("matrixDamaged");
  };

  var update = function() {
    time --;
    window.playerDamaged = false;
    document.getElementById("matrix").classList.remove("matrixDamaged");
    document.getElementById("matrix").classList.add("matrixRegular");
    Object.keys(itemsOfOrbit).forEach((orbit) => {
      itemsOfOrbit[orbit].forEach((item) => {
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
    ctx.beginPath();
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[4], 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fill();
    ctx.closePath();

    ctx.lineWidth = 1;
    if (window.playerDamaged){
      ctx.strokeStyle = "#e51300";
    } else {
      ctx.strokeStyle = "black";
    }
    ctx.save();
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    //orbit paths
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[0], 0, 2 * Math.PI);
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[1], 0, 2 * Math.PI);
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[2], 0, 2 * Math.PI);
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[3], 0, 2 * Math.PI);
    ctx.arc(center[0], center[1], innerCircleWidth + orbits[4], 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    var playerPosX = center[0] + playerObject.x(playerObject.radian, playerObject.orbit) - 15;
    var playerPosY = center[1] + playerObject.y(playerObject.radian, playerObject.orbit) - 15;

    var angle = Math.atan2(playerPosY + 15 - center[1], playerPosX + 15 - center[0]) - Math.PI / 2;

    ctx.save();
    ctx.shadowColor = "orange";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 6;

    ctx.translate(playerPosX + 15, playerPosY + 15);
    ctx.rotate(Math.PI/6 + angle);
    ctx.drawImage(playerImage, -15, -15, 34 , 34);
    ctx.restore();
    ctx.save();
    ctx.translate((center[0] + center[0]/3), center[1]/10);
    ctx.font = "24px courier";
    ctx.fillStyle="#FFFFFF";
    ctx.fillText(`Time: ${time}ms`, -center[0], 0);
    if (window.playerDamaged){
      ctx.fillStyle="#e51300";
      ctx.fillText(`Detection: ${parseInt((100 - life))}%`, 0, 0);
    } else {
      ctx.fillText(`Detection: ${parseInt((100 - life))}%`, 0, 0);
    }
    ctx.restore();


    ctx.save();
    ctx.lineWidth = 14;
    ctx.lineCap = "square";
    //draw the objects in each orbit
    Object.keys(itemsOfOrbit).forEach((orbitKey) => {
      itemsOfOrbit[orbitKey].forEach((item) => {
        ctx.beginPath();
        if (item.type === "killer"){
          ctx.strokeStyle = "#e51300";
          ctx.arc(center[0], center[1], innerCircleWidth + orbits[orbitKey], item.startArc, item.startArc + Math.PI/6);
        } else {
          ctx.strokeStyle = "#05ad1b";
          ctx.arc(center[0], center[1], innerCircleWidth + orbits[orbitKey], item.startArc, item.startArc + Math.PI/6);
        }
        ctx.stroke();
        ctx.closePath();
      });
    });
    ctx.restore();

  };

  life = 100;
  time = 1000;
  var playing = true;
  var mainLoop = function () {
    var now = Date.now();

    update();
    render();
    requestAnimationFrame(mainLoop);
  };

  mainLoop();

};
