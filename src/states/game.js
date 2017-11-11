import Library from '../library';
import Board from '../prefabs/board';
import Piece from '../prefabs/piece';
import CancelBtn from '../prefabs/cancel-btn';
import SubmitBtn from '../prefabs/submit-btn';
import Score from '../prefabs/score';
import Gold from '../prefabs/gold';
import Timer from '../prefabs/timer';
import AchievementMonitor from '../prefabs/achievement-monitor';

export default class GameState extends Phaser.State {
    init(level) {
        // game constant
        this.game.stage.backgroundColor = '#000';
        this.currentLevel = level ? level : 1;
        this.GAMEX = this.game.world.width;
        this.GAMEY = this.game.world.height;

        this.keyboard = this.game.input.keyboard.createCursorKeys();
        this.keyboard.space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // setup game prefabs
        this.newTileDrop = false;

        this.library = new Library();

        this.board = new Board(this.game, this);
        this.piece = new Piece(this.game, this);
        this.cancelBtn = new CancelBtn(this.game, this);
        this.submitBtn = new SubmitBtn(this.game, this);
        this.score = new Score(this.game, this);
        this.gold = new Gold(this.game, this);

        this.achievementMonitor = new AchievementMonitor();
    }

    create() {
        this.loadLevel();
        this.submitBtn.createSubmitBtn(this.wordSubmit);
        this.cancelBtn.createCancelBtn(this.wordCancel);
        this.game.wordLengthHistory = {};
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
            click_position = this.library.click(pointer);
        }, this);

        this.game.input.onUp.add(function(pointer) {
            // click_release contains an x and a y AND a direction
            click_release = this.library.release_click(pointer, click_position, swipeVsTap);
            if (click_release.direction == 'tap') {
                // console.log("tapped");
            }
            else if (click_release.direction) {
                if (this.newTileDrop) {
                    var pieceArray;
                    if (click_release.direction == 'left') {
                        // shift the new piece to the left
                        pieceArray = this.board.findNewPiece();
                        if (pieceArray[0] && pieceArray[0].gridx > 0) {
                            pieceArray.forEach((unit) => {
                                this.piece.move(unit, {x: unit.gridx - 1, y: unit.gridy});
                            });
                        }
                    }
                    if (click_release.direction == 'right') {
                        // shift the new piece to the right
                        pieceArray = this.board.findNewPiece();
                        console.log(pieceArray);
                        pieceArray.reverse();
                        if (pieceArray[0] && pieceArray[0].gridx < this.board.columns - 1) {
                            pieceArray.forEach((unit) => {
                                this.piece.move(unit, {x: unit.gridx + 1, y: unit.gridy});
                            });
                        }
                    }
                    if (click_release.direction == 'down') {
                        // drop the new piece
                        this.board.letterFall();
                    }
                    if (click_release.direction == 'up') {
                        // Rotate the new piece
                        this.piece.rotate();
                        console.log("rotating");
                    }
                }
                // console.log("swiped " + click_release.direction);
            }
        }, this);

        // Create / Start the Timer
        this.timer = new Timer(this.game, this.game.world.width / 2, 0);
        this.game.add.existing(this.timer);
    }

    update() {
        // runs many times a second
    }

    isWord(word) {
        // O(n) slow lazy scan for now
        return this.board.wordsText.indexOf("\n" + word.toLowerCase() + "\n") > 0;
    }

    loadLevel(level) {
        var levels = this.game.cache.getJSON('levels');
        this.levelData = levels['level' + this.currentLevel];
        this.board.create(this.levelData);
        this.score.create();
        this.gold.create();
        if (this.levelData.winCondition.longWords) {
            this.longWords = 0;
        }
    }

    wordSubmit() {
        var word = this.board.currentWord.text;
        if (this.isWord(word)) {
            this.getWordScore(word);
            console.log(word.length);
            // this.game.wordLengthHistory.{word.length};
            this.board.killSelectedLetters();
            this.board.letterFall();
            this.wordCancel();
            var won = this.checkWin();
            if (!won) {
               this.board.newPiece();
            }
        }
        else {
            this.wordCancel();
        }
    }

    checkLose() {
        var loseRow = this.board.rows - 3;

        for (var x = 0; x < this.board.columns; x++) {
            var tile = this.board.board[x][loseRow];
            if (typeof(tile) !== 'undefined') {
                console.log("You LOSE!!!");
                this.triggerOverLay();
                return 1;
            }
        }
        return 0;
    }

    checkWin() {
        if (this.levelData.winCondition.gold) {
            for (var y = 0; y < this.board.rows; y++) {
                for (var x = 0; x < this.board.columns; x++) {
                    var tile = this.board.board[x][y];
                    if (tile && tile.special == 'gold') {
                        return 0;
                    }
                }
            }
        }
        var longWordsParams = this.levelData.winCondition.longWords;
        if (longWordsParams
            && this.longWords < longWordsParams.count) {
            return 0;
        }
        console.log("You WIN!!!");

        // achievements
        var levelStats = {
            time: this.timer.getTime()
        };

        this.levelData.speedAchievementSeconds = levelStats.time + 1; // DEBUG: testing speed achievement success
        // this.levelData.speedAchievementSeconds = levelStats.time; // DEBUG: testing speed achievement failure
        var achievements = this.achievementMonitor.checkForAchievements(this.levelData, levelStats);

        if(achievements.length > 0) {
            // TODO: add level achienves attained to level completed overlay
            console.log("Congrats you got the following achievements!", achievements);
        }

        // level completed overlay
        this.triggerOverLay();
        return 1;
    }

    wordCancel() {
        this.board.deselectAll();
        this.board.currentWord.text = '';
    }

    getWordScore(word) {
        var longWordsParams = this.levelData.winCondition.longWords;
        if (longWordsParams) {
            this.longWords += word.length >= longWordsParams.minLength ? 1 : 0;
        }
        this.score.add(word.length * word.length);
        this.gold.add(word.length > 5 ? 1 : 0);
    }

    triggerOverLay() {
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
                'Best Score: ' + this.score.Score.text, style).anchor.setTo(0.5);

            this.add.text(this.GAMEX/2, this.GAMEY/2 + 40,
                'Your Score: ' + this.score.Score.text, style).anchor.setTo(0.5);

            if (this.score.text == this.score.text) {
                style = {font: '35px Arial', fill: '#f80'};
                this.add.text(this.GAMEX/2, this.GAMEY/2 + 80,
                        'New Record!!!', style).anchor.setTo(0.5);
            }

            this.replayLevelIcon = this.add.button(this.GAMEX/2, this.GAMEY * 3/4, 'green_tile', (btn) => { this.state.start('Game', true, false, btn.customParams.levelNumber); }, this);
            this.replayLevelIcon.customParams = {};
            this.replayLevelIcon.customParams.levelNumber = this.currentLevel;
            this.replayLevelIcon.width = this.game.width / 5 - 2;
            this.replayLevelIcon.height = this.game.width / 5 - 2;
            this.replayLevelIcon.anchor.setTo(0.5);
            this.replayArrow = this.add.sprite(this.replayLevelIcon.position.x, this.replayLevelIcon.position.y, 'replay');
            this.replayArrow.anchor.setTo(0.5);
            this.replayArrow.scale.setTo(this.replayLevelIcon.width/this.replayArrow.width*0.6);

            this.playNextLevelIcon = this.add.button(this.GAMEX * 3/4, this.GAMEY * 3/4, 'green_tile', (btn) => { this.state.start('Game', true, false, btn.customParams.levelNumber); }, this);
            this.playNextLevelIcon.customParams = {};
            this.playNextLevelIcon.customParams.levelNumber = this.currentLevel + 1;
            this.playNextLevelIcon.width = this.game.width / 5 - 2;
            this.playNextLevelIcon.height = this.game.width / 5 - 2;
            this.playNextLevelIcon.anchor.setTo(0.5);
            this.playArrow = this.add.sprite(this.playNextLevelIcon.position.x + 4, this.playNextLevelIcon.position.y, 'continue');
            this.playArrow.anchor.setTo(0.5);
            this.playArrow.scale.setTo(this.playNextLevelIcon.width/this.playArrow.width*0.6);

            this.levelSelectorIcon = this.add.button(this.GAMEX/4, this.GAMEY * 3/4, 'green_tile', (btn) => { this.state.start('LevelSelector'); }, this);
            this.levelSelectorIcon.width = this.game.width / 5 - 2;
            this.levelSelectorIcon.height = this.game.width / 5 - 2;
            this.levelSelectorIcon.anchor.setTo(0.5);
            this.menuIcon = this.add.sprite(this.levelSelectorIcon.position.x, this.levelSelectorIcon.position.y, 'menu');
            this.menuIcon.anchor.setTo(0.5);
            this.menuIcon.scale.setTo(this.levelSelectorIcon.width/this.menuIcon.width*0.6);

        }, this);

        levelCompletePanel.start();
    }
}
