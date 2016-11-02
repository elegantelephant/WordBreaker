var WB = WB || {};
WB.GameState = WB.GameState || {};

var Score = {};
var Gold = {};

Score.create = function() {
    this.Score = WB.game.add.text(WB.game.world.width - 10, 0);
    this.Score.anchor.setTo(1,0);
    this.Score.text = 0;
    this.Score.style.font = 'bold 20pt Arial';
    this.Score.style.fill = "#fff";
    this.Score.text = 0;
};

Score.add = function(scoreadd) {
    this.Score.text = +this.Score.text + scoreadd;
}

Score.reset = function() {
    this.Score.text = 0;
}

Gold.create = function() {
    this.Gold = WB.game.add.text(10, 0);
    this.Gold.text = 0;
    this.Gold.style.font = 'bold 20pt Arial';
    this.Gold.style.fill = "#FFD700";
};

Gold.add = function(goldadd) {
    this.Gold.text = +this.Gold.text + goldadd;
}

Gold.reset = function() {
    this.Gold.text = 0;
}

WB.GameState.Score = Score;
WB.GameState.Gold = Gold;
