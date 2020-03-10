/*
 * Mitchell Douma
 */
//global variables


(function() {

    var player;
    var playerImage = new Image();
    var canvas;
    var positionX = 0;
    var positionY = 0;
    var mouseX;
    var mouseY;
    var previousPositionX;
    var previousPositionY;




    function gameLoop() {
        window.requestAnimationFrame(gameLoop);

        player.update();
        player.render();
    }

    //start game loop as soon as sprite sheet loads
    playerImage.addEventListener("load", gameLoop);
    playerImage.src = "sprites/RedCar.png";

    function sprite(options) {

        var that = {};

        var frameIndex = 1,
            tickCount = 0,
            ticksPerFrame = 15;
        numberOfFrames = options.numberOfFrames || 1;

        var deadCount = 0;
        var invincibleCount = 0;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        that.loop = options.loop;

        that.update = function() {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {
                previousPositionX = positionX;
                previousPositionY = positionY;



                tickCount = 0;
                if (!globalPlayerVariables.isDead) {
                    positionX = mouseX - 109;
                    positionY = mouseY - 50;
                }

                if (globalPlayerVariables.isInvincible) {
                    invincibleCount++;
                    frameIndex++;
                    if (frameIndex > 4) {
                        frameIndex = 0;
                    } else if (frameIndex > 1) {
                        frameIndex = 4;
                    }
                    if (invincibleCount > 15) {
                        globalPlayerVariables.isInvincible = false;
                        invincibleCount = 0;
                    }
                } else if (globalPlayerVariables.isDead) {
                    deadCount++;
                    if (frameIndex < 3) {
                        frameIndex++;
                    } else {
                        frameIndex = 2;
                    }
                    if (deadCount > 30) {
                        globalPlayerVariables.isDead = false;
                        deadCount = 0;
                        spawnPlayer();
                    }
                } else {
                    if (frameIndex < 1) {
                        frameIndex++;
                    } else {
                        frameIndex = 0;
                    }
                }
            }
        };

        that.render = function() {

            //clear canvas   
            if (globalPlayerVariables.isDead) {
                that.context.clearRect(previousPositionX, previousPositionY, that.width / numberOfFrames, that.height);
            } else {
                that.context.clearRect(previousPositionX, previousPositionY, that.width / numberOfFrames, that.height);
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

    function spawnPlayer() {
        globalPlayerVariables.isDead = false;
        player = sprite({
            context: canvas.getContext("2d"),
            width: 876,
            height: 100,
            image: playerImage,
            numberOfFrames: 4,
            ticksPerFrame: 1,
        });
        positionX = window.innerWidth + 100;
        positionY = window.innerHeight + 100;
        globalPlayerVariables.life = 5;
        updateLife(globalPlayerVariables.life);
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
        return position
    }

    function move(e) {
        var location = {};
        var position = getElementPosition(canvas);
        mouseX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
        var canvasScaleRatio = canvas.width / canvas.offsetWidth;
        location.x = (mouseX - position.x) * canvasScaleRatio;
        location.y = (mouseY - position.y) * canvasScaleRatio;
    }

    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    spawnPlayer();

    gameLoop();

    canvas.addEventListener("onmousemove", move);
    canvas.addEventListener("mousemove", move);
}());