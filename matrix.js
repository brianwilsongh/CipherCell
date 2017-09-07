var enterMatrix = function (){

    // geting canvas by id c
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    var highlightTextColor = "#e51300";

    //making the canvas full screen
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    //chinese characters - taken from the unicode charset
    var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    var matrix2 = "作为人团体再出发行单曲能向国际四方发展ザ少年倶楽部プレミア演唱会记录历年演唱会音乐作品活动企划";
    var matrix3 = "ところでこのガッテンこちらの名前の方が馴染みがあるという方も多いのではないだろうかためしてガッテン";
    var matrix4 = "АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя";
    matrix = matrix.concat(matrix2).concat(matrix3).concat(matrix4);      //converting the string into an array of single characters
    matrix = matrix.split("");

    var font_size = 10;
    var columns = c.width/font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++)
        drops[x] = 1;

    //experimental!
    //store the position of the mouse
    var mousePosX = 0;
    var mousePosY = 0;
    function paint(e) {
        var pos = getMousePos(c, e);
        mousePosX = pos.x;
        mousePosY = pos.y;
    }
    window.addEventListener('mousemove', paint);
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    //drawing the characters
    function draw()
    {
        console.log("matrix drawing!");
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#0F0"; //green text
        ctx.font = font_size + "px arial";
        //looping over drops
        for(var i = 0; i < drops.length; i++)
        {
            //a random chinese character to print
            var text = matrix[Math.floor(Math.random()*matrix.length)];

            if ((drops[i]*font_size > mousePosY)&&((i*font_size - font_size/3) < mousePosX)&&(i*font_size + font_size) > mousePosX){
              //if it's below the mouse's y position
              ctx.fillStyle = "#e51300";
            } else {
              ctx.fillStyle = "#0F0";
            }


            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i*font_size, drops[i]*font_size);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if(drops[i]*font_size > c.height && Math.random() > 0.985)
                drops[i] = 0;

            //incrementing Y coordinate
            drops[i]++;
        }
    }
    setInterval(draw, 52);
};

module.exports = enterMatrix;
