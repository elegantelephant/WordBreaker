var WB = WB || {};

WB.GameState = WB.GameState || {};

WB.GameState.init = function(level) {

    // game constants
    this.game.stage.backgroundColor = '#000';
    this.currentLevel = level ? level : 1;

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
            if (WB.GameState.newTileDrop) {
                var pieceArray;
                if (click_release.direction == 'left') {
                    // shift the new piece to the left
                    pieceArray = WB.GameState.Board.findNewPiece();
                    if (pieceArray[0].tile.gridx > 0) {
                        pieceArray.forEach(function(unit) {
                            WB.GameState.Piece.move(unit, {x: unit.tile.gridx - 1, y: unit.tile.gridy});
                        });
                    }
                }
                if (click_release.direction == 'right') {
                    // shift the new piece to the right
                    pieceArray = WB.GameState.Board.findNewPiece();
                    pieceArray.reverse();
                    if (pieceArray[0].tile.gridx < this.Board.columns - 1) {
                        pieceArray.forEach(function(unit) {
                            WB.GameState.Piece.move(unit, {x: unit.tile.gridx + 1, y: unit.tile.gridy});
                        });
                    }
                }
                if (click_release.direction == 'down') {
                    // drop the new piece
                    WB.GameState.Board.letterFall();
                }
                if (click_release.direction == 'up') {
                    // Rotate the new piece
                    WB.GameState.Piece.rotate();
                    console.log("rotating");
                }
            }
            // console.log("swiped " + click_release.direction);
        }
    }, this);
};

WB.GameState.update = function() {
    // runs many times a second
};

WB.GameState.isWord = function(word) {
    // O(n) slow lazy scan for now
    return this.Board.wordsText.indexOf("\n" + word.toLowerCase() + "\n") > 0;
};

WB.GameState.loadLevel = function(level) {
    var levels = JSON.parse(this.game.cache.getText('levels'));
    this.levelData = levels['level' + this.currentLevel];
    this.Board.create(this.levelData);
    this.Score.create();
    this.Gold.create();
};

WB.GameState.wordSubmit = function() {
    var word = WB.GameState.Board.currentWord.text;
    if (WB.GameState.isWord(word)) {
        var score = WB.GameState.getWordScore(word);
        WB.GameState.Score.add(+score.points);
        WB.GameState.Gold.add(+score.gold);
        WB.GameState.Board.killSelectedLetters();
        WB.GameState.Board.letterFall();
        WB.GameState.wordCancel();
        WB.GameState.checkWin();
        WB.GameState.Board.newPiece();
    }
    else {
        WB.GameState.wordCancel();
    }
};

WB.GameState.checkLose = function() {
    var loseRow = this.Board.rows - 3;
    for (var x = 0; x < this.Board.columns; x++) {
        if (typeof(this.Board.board[x][loseRow].tile) == 'object') {
            console.log("You LOSE!!!");
            return 1;
        }
    }
    return 0;
};

WB.GameState.checkWin = function() {
    for (var y = 0; y < this.Board.rows; y++) {
        for (var x = 0; x < this.Board.columns; x++) {
            if (typeof(this.Board.board[x][y].special) == 'string'
                && this.Board.board[x][y].special == 'gold') {
                    return 1;
            }
        }
    }
    console.log("You WIN!!!");
    // this.triggerOverLay();
    return 0;
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

WB.GameState.triggerOverLay = function() {
    this.overlay = this.add.bitmapData(this.GAMEX, this.GAMEY);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, this.GAMEX, this.GAMEY);
    this.panel = this.add.sprite(0, this.GAMEY, this.overlay);
    this.panel.alpha = 0.65;

    var levelCompletePanel = this.add.tween(this.panel);
    levelCompletePanel.to({y: 0}, 500);

    levelCompletePanel.onComplete.add(function() {
        var style = {font: '40px Arial', fill: '#fff'};
        this.add.text(this.GAMEX/2, this.GAMEY/2 - 90,
            'Congratulations!', style).anchor.setTo(0.5);
        this.add.text(this.GAMEX/2, this.GAMEY/2 - 40,
            'Level Complete!', style).anchor.setTo(0.5);

        style = {font: '30px Arial', fill: '#fff'};
        this.add.text(this.GAMEX/2, this.GAMEY/2 + 10,
            'Best Score: ' + this.Score.text, style).anchor.setTo(0.5);

        this.add.text(this.GAMEX/2, this.GAMEY/2 + 40,
            'Your Score: ' + this.Score.text, style).anchor.setTo(0.5);

        if (this.Score.text == this.Score.text) {
            style = {font: '35px Arial', fill: '#f80'};
            this.add.text(this.GAMEX/2, this.GAMEY/2 + 80,
                    'New Record!!!', style).anchor.setTo(0.5);
        }

        this.replayLevelIcon = this.add.button(this.GAMEX/2, this.GAMEY * 3/4, 'level_button', WB.HomeState.startGameState, this);
        this.replayLevelIcon.customParams = {};
        this.replayLevelIcon.customParams.levelNumber = this.currentLevel;
        this.replayLevelIcon.width = this.game.width / 5 - 2;
        this.replayLevelIcon.height = this.game.width / 5 - 2;
        this.replayLevelIcon.anchor.setTo(0.5);
        this.replayArrow = this.add.sprite(this.replayLevelIcon.position.x, this.replayLevelIcon.position.y, 'replay');
        this.replayArrow.anchor.setTo(0.5);
        this.replayArrow.scale.setTo(this.replayLevelIcon.width/this.replayArrow.width*0.6);

        this.playNextLevelIcon = this.add.button(this.GAMEX * 3/4, this.GAMEY * 3/4, 'level_button', WB.HomeState.startGameState, this);
        this.playNextLevelIcon.customParams = {};
        this.playNextLevelIcon.customParams.levelNumber = this.nextLevel;
        this.playNextLevelIcon.width = this.game.width / 5 - 2;
        this.playNextLevelIcon.height = this.game.width / 5 - 2;
        this.playNextLevelIcon.anchor.setTo(0.5);
        this.playArrow = this.add.sprite(this.playNextLevelIcon.position.x + 4, this.playNextLevelIcon.position.y, 'continue');
        this.playArrow.anchor.setTo(0.5);
        this.playArrow.scale.setTo(this.playNextLevelIcon.width/this.playArrow.width*0.6);

        this.levelSelectorIcon = this.add.button(this.GAMEX/4, this.GAMEY * 3/4, 'level_button', WB.HomeState.startLevelSelectorState, this);
        this.levelSelectorIcon.width = this.game.width / 5 - 2;
        this.levelSelectorIcon.height = this.game.width / 5 - 2;
        this.levelSelectorIcon.anchor.setTo(0.5);
        this.menuIcon = this.add.sprite(this.levelSelectorIcon.position.x, this.levelSelectorIcon.position.y, 'menu');
        this.menuIcon.anchor.setTo(0.5);
        this.menuIcon.scale.setTo(this.levelSelectorIcon.width/this.menuIcon.width*0.6);

    }, this);

    levelCompletePanel.start();
};
