// canvas
var canvas = document.getElementById("cBier");
var ctx = canvas.getContext("2d");

// image
var img = new Image();
img.src = './img/bier.png';

// globals
var enabled = true;
var interval;
var bubbles = [];

// create new bubble
function createBubble () {
    return {
        rad: Math.random() * 2,
        x: Math.random() * 100 + 80,
        y: 625,
        end: false
    }
}

// mouse click
canvas.onclick = function () {
    enabled = enabled !== true;
};

// animate
img.onload = function () {
    var i = 0;

    canvas.width = this.width << 1; //double the canvas width
    canvas.height = this.height << 1; //double the canvas height

    interval = setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 249, 695);

        if (i % 30 === 0 && enabled) {
            bubbles[bubbles.length] = createBubble();
        }

        for (var j = 0; j < bubbles.length; j++) {
            if (bubbles[j].end === false) {
                ctx.beginPath();
                ctx.arc(bubbles[j].x, bubbles[j].y, bubbles[j].rad, 0, 2 * Math.PI);
                ctx.stroke();

                if (enabled) {
                    bubbles[j].y -= bubbles[j].rad;
                }

                if (bubbles[j].y <= 175) {
                    bubbles[j].end = true;
                }
            }
        }

        i++;
    }, 10);
};



