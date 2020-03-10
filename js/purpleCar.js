/*
 * Mitchell Douma
 */
(function() {

    var car;
    var carImage = new Image();
    var canvas;
    var dead = false;
    var positionX = 0;
    var positionY = 0;
    var LANE1 = 120;
    var LANE2 = 240;
    var LANE3 = 360;
    var LANE4 = 480;
    var LANE5 = 600;
    var LANE6 = 720;
    var spawn = Math.random() * (5000 - 1) + 1;

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);

        car.update();
        car.render();
    }

    //start game loop as soon as sprite sheet loads
    carImage.addEventListener("load", gameLoop);
    carImage.src = "sprites/PurpleCar.png";



    function sprite(options) {

        var that = {};

        var frameIndex = 3,
            tickCount = 0,
            ticksPerFrame = 15;
        numberOfFrames = options.numberOfFrames || 1;

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
                } else if (globalPlayerVariables.isDead) {
                    positionX += 50;
                } else {
                    positionX -= 20;
                }


                if (positionX + that.width < 0) {
                    setTimeout(spawnCar, spawn);
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
        };

        that.render = function() {

            //clear canvas   
            if (dead) {
                that.context.clearRect(positionX + 50, positionY, that.width / numberOfFrames, that.height);
            } else if (globalPlayerVariables.isDead) {
                that.context.clearRect(positionX - 50, positionY, that.width / numberOfFrames, that.height);
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

    function spawnCar() {
        dead = false;
        car = sprite({
            context: canvas.getContext("2d"),
            width: 876,
            height: 100,
            image: carImage,
            numberOfFrames: 4,
            ticksPerFrame: 1,
        });
        positionX = window.innerWidth;
        if (Math.random() * (window.innerHeight - 1) + 1 < LANE1) {
            positionY = LANE1 - car.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE2) {
            positionY = LANE2 - car.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE3) {
            positionY = LANE3 - car.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE4) {
            positionY = LANE4 - car.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE5) {
            positionY = LANE5 - car.getFrameHeight();
        } else {
            positionY = LANE6 - car.getFrameHeight();
        }

    }

    function getElementPosition(element) {
        var parentOffset;
        var position = {
            x: element.offsetLeft,
            y: element.offsetTop
        };
        if (element.offsetParent) {
            parentOffset = getElementPosition(element.offsetParent);
            position.x += parentOffset.x;
            position.y += parentOffset.y;
        }
        return position;
    }

    function collision(e) {
        var location = {};
        var position = getElementPosition(canvas);
        mouseX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
        var canvasScaleRatio = canvas.width / canvas.offsetWidth;
        location.x = (mouseX - position.x) * canvasScaleRatio;
        location.y = (mouseY - position.y) * canvasScaleRatio;

        if (location.x - car.getFrameWidth() / 2 < positionX + car.getFrameWidth() &&
            location.x + car.getFrameWidth() / 2 > positionX &&
            location.y - car.getFrameHeight() / 2 < positionY + car.getFrameHeight() &&
            location.y + car.getFrameHeight() / 2 > positionY) {
            dead = true;
            if (!globalPlayerVariables.isInvincible && !globalPlayerVariables.isDead) {
                globalPlayerVariables.life--;
                globalPlayerVariables.isInvincible = true;
                if (globalPlayerVariables.life <= 0) {
                    globalPlayerVariables.isDead = true;
                }
                updateLife(globalPlayerVariables.life);
            }
        }
    }


    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    spawnCar();
    gameLoop();

    canvas.addEventListener("onmousemove", collision);
    canvas.addEventListener("mousemove", collision);
}());