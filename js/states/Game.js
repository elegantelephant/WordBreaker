var WB = WB || {};

WB.GameState = WB.GameState || {};

WB.GameState.init = function() {

    // game constants
    this.game.stage.backgroundColor = '#000';

    this.GAMEX = this.game.world.width;
    this.GAMEY = this.game.world.height;

    this.keyboard = this.game.input.keyboard.createCursorKeys();
    this.keyboard.space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
};

WB.GameState.create = function() {
    this.loadLevel();
    this.SubmitBtn.createSubmitBtn(WB.GameState.wordSubmit);
    this.CancelBtn.createCancelBtn(WB.GameState.wordCancel);
    // this.player = this.createCharacter('player', 0, 0, 'right');
    // this.game.physics.arcade.enable(this.player);
    // this.player.body.setSize(60, 60, 0, 0);

    // Enable SWIPING for this game
    var click_position = {};
    var click_release = {};
    var swipeVsTap = 11;

    // this is the number of pixels they have to move their finger
    //  before it consideres it as a swipe rather than a tap.

    this.game.input.onDown.add(function(pointer) {
		// click_position contains an x and a y
        click_position = library.click(pointer);
    }, this);
    this.game.input.onUp.add(function(pointer) {
		// click_release contains an x and a y AND a direction
        click_release = library.release_click(pointer, click_position, swipeVsTap);
        if (click_release.direction == 'tap') {
			// console.log("tapped");
		}
		else if (click_release.direction) {
			// console.log("swiped " + click_release.direction);
		}
	}, this);
};

WB.GameState.isWord = function() {
    // O(n) slow lazy scan for now
    return this.Board.wordsText.indexOf("\n" + this.Board.currentWord.toLowerCase + "\n") > 0;
};

WB.GameState.update = function() {
    // runs many times a second
};

WB.GameState.loadLevel = function() {
    // abstractify the levels to be dynamically generated
    var rows = 8;
    var columns = 9;
    this.Board.create();
    this.Score.create();
    this.Gold.create();
};

WB.GameState.wordSubmit = function() {
    var word = WB.GameState.Board.currentWord;
    if (WB.GameState.isWord(word)) {
        var score = WB.GameState.getWordScore(word);
        WB.GameState.Score.add(+score.points);
        WB.GameState.Gold.add(+score.gold);
        WB.GameState.wordCancel();
        //TODO remove letter tiles
    }
    else {
        WB.GameState.wordCancel();
    }
};

WB.GameState.wordCancel = function() {
    WB.GameState.Board.deselectAll();
    WB.GameState.Board.currentWord.text = '';
};

WB.GameState.getWordScore = function(word) {
    var score = {};
    score.points = word.length * word.length;
    score.gold = word.length > 5 ? 1 : 0;
    return score;
};
