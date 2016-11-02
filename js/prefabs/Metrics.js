var WB = WB || {};
WB.GameState = WB.GameState || {};

var Score = {};
var Gold = {};

Score.createScore = function() {
    this.SCORE = this.SCORE || 0;
    var x_cord = WB.game.world.width - 10;
    text = WB.game.add.text(x_cord, 0);
    text.anchor.setTo(1,0);
    text.text = this.SCORE;
    text.style.font = 'bold 20pt Arial';
    text.style.fill = "#fff";
};

Gold.createGold = function() {
    this.Gold = this.Gold || 0; //Change to get Gold from Firebase as it should be available between sessions
    text = WB.game.add.text(10, 0);
    text.text = this.Gold;
    text.style.font = 'bold 20pt Arial';
    text.style.fill = "#FFD700";
};

WB.GameState.Score = Score;
WB.GameState.Gold = Gold;
