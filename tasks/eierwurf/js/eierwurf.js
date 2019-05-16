// canvas
var canvas = document.getElementById('cEierwurf');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var width = canvas.width;
var height = canvas.height;

// images
var nest = new Image();
nest.src = "./img/osternest.png";
var egg = new Image();
egg.src = "./img/ei.png";
var stein = new Image();
stein.src = "./img/stein.png";
var hase = new Image();
hase.src = "./img/osterhase-ohne-ei_400x408.png";
var brokenEgg = new Image();
brokenEgg.src = "./img/brokenEgg.png";

// sounds
var shotSound = new Audio('./audio/shot.mp3');
var hitSound = new Audio('./audio/hit.mp3');

// variables
var x0 = 285, y0 = 345;                 // initial coordinates
var x = x0, y = y0;                     // set current coordinates
var v0x = 0.7, v0y = 0.7;               // starting speed
var speedFactor = 1, heightFactor = 1;  // speed from hitting point
var dt = 10;                            // interval
var g = 0.0095;                         // gravity
var hits = 0, tries = 0, counter = 0;   // counters
var stopped = true;                     // booleans to save game status
var random = Math.floor(Math.random() * (+(width-150) - +width/2)) + +width/2; // random number between middle and right end of canvas
var i = 0, t = 0;                       // timer
var mouseX, mouseY;                     // mouse coordinates
var brokenEggs = [];                    // array to store all broken egg cords

/* Function, which draws the images, calculates the flight path and increments the counters */
function draw() {
    setInterval(function () {
        // clear canvas
        ctx.clearRect(0, 0, width, height);

        // draw nest & egg
        ctx.drawImage(egg, x, y, 75, 70);
        ctx.drawImage(nest, random, 440, 200, 150);
        ctx.drawImage(stein, 50, 480, 350, 200);
        ctx.drawImage(hase, 100, 280, 250, 250);

        // egg is flying
        if (!stopped) {
            // calculation
            x = x0 + v0x + t * speedFactor;
            y = y0 - (v0y * 1.5 * heightFactor) * t + 0.5 * g * Math.pow(t, 2);
            i++;
            t = i / 1.5 * dt;

            // collision with nest
            if (x >= random-40 && x <= random + 170 && y >= 470) {
                // count
                hits++;
                tries++;
                counter++;

                // play sound
                hitSound.play();

                // reset position
                stopped = true;
                x = x0;
                y = y0;
            } else if (y >= 470) { // collision with gras
                // count
                tries++;
                counter++;

                // save coordinates
                brokenEggs.push(x);
                brokenEggs.push(y);

                // reset position
                stopped = true;
                x = x0;
                y = y0;
            }

            // move nest to a different place
            if (counter % 3 === 0 && counter > 0) {
                random = Math.floor(Math.random() * (+(width-150) - +width/2)) + +width/2;
                counter = 0;

                // remove broken eggs
                brokenEggs = [];
            }
        } else { // aiming
            aim();
        }

        // set text of tries
        document.getElementById('versuche').innerHTML = "Versuche: "+tries;

        // draw eggs for the number of hits
        switch (hits) {
            case 1:
                ctx.drawImage(egg, width-320, 40, 85, 80);
                break;
            case 2:
                ctx.drawImage(egg, width-320, 40, 85, 80);
                ctx.drawImage(egg, width-220, 40, 85, 80);
                break;
            case 3:
                ctx.drawImage(egg, width-320, 40, 85, 80);
                ctx.drawImage(egg, width-220, 40, 85, 80);
                ctx.drawImage(egg, width-120, 40, 85, 80);
                break;
        }

        // display broken eggs
        for (var a = 0; a < brokenEggs.length; a+=2) {
            ctx.drawImage(brokenEgg, brokenEggs[a], brokenEggs[a+1], 100, 100);
        }

        // victory
        if (hits === 3) {
            // display text
            ctx.font = "80px Arial";
            ctx.fillText("Victory :)", canvas.width/2.5, 200);

            // delay restart
            setTimeout(function () {
                // reset
                stopped = true;
                x = x0;
                y = y0;
                hits = 0;
                tries = 0;
                brokenEggs = [];
            }, 1000);
        }
    }, 10);
}

/* displaying the aiming lines */
function aim() {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(mouseX*1.25, mouseY*1.25);
    ctx.lineTo(307, 400);

    // deactivate lines if outside a certain area
    if (mouseX >= 280 || mouseY <= 350 || mouseY >= 550) {
        ctx.closePath();
    } else {
        ctx.stroke();
    }
}

/* validate mouse position and fire shot */
function throwEgg() {
    // only when aiming and correct click area
    if (stopped && !(mouseX >= 280 || mouseY <= 350 || mouseY >= 550)) {
        // reset time
        i = 0;
        t = 0;

        // play sound
        shotSound.play();

        // shot fired
        stopped = false;
    }
}

// mouse handling
canvas.addEventListener("click", throwEgg); // detect mouse click
canvas.addEventListener("mousemove", function (evt) { // mouse movement detection
    // save x and y of current mouse position
    mouseX = evt.clientX - canvas.getBoundingClientRect().left;
    mouseY = evt.clientY - canvas.getBoundingClientRect().top;

    // do not update x,y when egg is flying
    if (stopped) {
        speedFactor = (285-mouseX)/ 100 + 1;
        heightFactor = (mouseY - 345)/100;
    }
});

// execute
window.onload = function () {
    draw();
};