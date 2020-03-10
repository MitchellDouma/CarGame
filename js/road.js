/*
 * Mitchell Douma
 */
(function() {

    var road;
    var roadImage = new Image();
    var canvas;
    var dead = false;
    var positionX = 0;
    var positionY = 0;
    var LANE1 = 120;
    var LANE2 = 240;
    var LANE3 = 360;
    var LANE4 = 480;

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);

        road.update();
        road.render();
    }

    //start game loop as soon as sprite sheet loads
    roadImage.addEventListener("load", gameLoop);
    roadImage.src = "sprites/road.png";



    function sprite(options) {

        var that = {};

        var frameIndex = 3,
            tickCount = 0,
            ticksPerFrame = 15;
        numberOfFrames = options.numberOfFrames || 1;

        var deadCount = 0;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        that.loop = options.loop;

        that.update = function() {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;
                if (dead) {
                    positionX -= 50;
                } else {
                    positionX -= 20;
                }


                if (positionX + that.width < 0) {
                    spawnRoad();
                }

                if (dead) {
                    if (frameIndex < 3) {
                        frameIndex++;
                    } else {
                        frameIndex = 2;
                    }

                } else if (frameIndex < 1) {
                    frameIndex++;
                } else {
                    frameIndex = 0;
                }

            }
            //console.log(positionX);
        };

        that.render = function() {

            //clear canvas   
            if (dead) {
                that.context.clearRect(positionX + 50, positionY, that.width / numberOfFrames, that.height);
            } else {
                that.context.clearRect(positionX + 20, positionY, that.width / numberOfFrames, that.height);
            }



            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / numberOfFrames,
                0,
                that.width / numberOfFrames,
                that.height,
                positionX,
                positionY,
                that.width / numberOfFrames,
                that.height);
        };
        that.getFrameWidth = function() {
            return that.width / numberOfFrames;
        };
        that.getFrameHeight = function() {
            return that.height;
        };
        return that;
    }

    function spawnRoad() {
        dead = false;
        road = sprite({
            context: canvas.getContext("2d"),
            width: 2000,
            height: 500,
            image: roadImage,
            numberOfFrames: 1,
            ticksPerFrame: 1,
        });
        positionX = 0;
        positionY = 0;

    }

    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    spawnRoad();
    gameLoop();

}());