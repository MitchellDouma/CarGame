/*
 * Mitchell Douma
 */

var globalPlayerVariables = {
    life: 5,
    isInvincible: false,
    isDead: false
};

function updateLife(life) {
    document.getElementById("life").innerHTML = "Life: " + life;
}