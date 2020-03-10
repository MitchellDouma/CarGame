/*
 * Mitchell Douma
 */
(function() {

    var truck;
    var truckImage = new Image();
    var canvas;
    var positionX = 0;
    var positionY = 0;
    var LANE1 = 120;
    var LANE2 = 240;
    var LANE3 = 360;
    var LANE4 = 480;
    var LANE5 = 600;

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);

        truck.update();
        truck.render();
    }

    //start game loop as soon as sprite sheet loads
    truckImage.addEventListener("load", gameLoop);
    truckImage.src = "sprites/Truck.png";



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

                positionX -= 50;



                if (positionX + that.width < 0) {
                    spawnTruck();
                }
                if (frameIndex < 1) {
                    frameIndex++;
                } else {
                    frameIndex = 0;
                }

            }
            //console.log(positionX);
        };

        that.render = function() {

            //clear canvas   

            that.context.clearRect(positionX + 50, positionY, that.width / numberOfFrames, that.height);

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

    function spawnTruck() {

        truck = sprite({
            context: canvas.getContext("2d"),
            width: 638,
            height: 100,
            image: truckImage,
            numberOfFrames: 2,
            ticksPerFrame: 1,
        });
        positionX = window.innerWidth;
        if (Math.random() * (window.innerHeight - 1) + 1 < LANE1) {
            positionY = LANE1 - truck.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE2) {
            positionY = LANE2 - truck.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE3) {
            positionY = LANE3 - truck.getFrameHeight();
        } else if (Math.random() * (window.innerHeight - 1) + 1 < LANE4) {
            positionY = LANE4 - truck.getFrameHeight();
        } else {
            positionY = LANE5 - truck.getFrameHeight();
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

        if (location.x - truck.getFrameWidth() / 2 < positionX + truck.getFrameWidth() &&
            location.x + truck.getFrameWidth() / 2 > positionX &&
            location.y - truck.getFrameHeight() / 2 < positionY + truck.getFrameHeight() &&
            location.y + truck.getFrameHeight() / 2 > positionY) {
            if (!globalPlayerVariables.isInvincible && !globalPlayerVariables.isDead) {
                globalPlayerVariables.life -= 4;
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

    spawnTruck();
    gameLoop();

    canvas.addEventListener("onmousemove", collision);
    canvas.addEventListener("mousemove", collision);
}());