var WB = WB || {};
WB.GameState = WB.GameState || {};

var Board = {};

Board.createBoard = function(level) {
    this.SIZEX = WB.game.world.width;
    this.SIZEY = WB.game.world.height;
    var rows = 9;
    var columns = 5;

    Board.generateGrid(rows, columns);
    Board.generateWordText();
    Board.createLetterPool();
    WB.game.world.bringToTop(this.texts);
};

Board.generateGrid = function(rows, cols) {
    this.board = [];
    var index = 0;
    var pixel_x;
    var pixel_y;
    this.tileSize = Math.floor(this.SIZEX / 8);
    this.texts = WB.game.add.group();
    for (var x = 0; x < cols; x++) {
        this.board[x] = [];
        for (var y = 0; y < rows; y++) {
            pixel_x = (x + 1.5) * this.tileSize;
            pixel_y = (this.SIZEY) - (y + 1.5) * this.tileSize;

            Board.addTile(pixel_x, pixel_y, x, y);
            Board.addLetter(pixel_x, pixel_y, x, y);
        }
    }
};

Board.addTile = function(pixX, pixY, x, y) {
    tile = WB.game.add.button(pixX, pixY, 'letter_tile', Board.clicked, this);
    tile.scale.setTo(this.tileSize / tile.width);
    tile.anchor.setTo(0.5);
    tile.customParams = {};
    tile.customParams.x = x;
    tile.customParams.y = y;
};

Board.addLetter = function(pixX, pixY, x, y) {
    text = this.texts.getFirstExists(false);
    if (!text) {
        text = WB.game.add.text(pixX, pixY);
        text.anchor.setTo(0.5);
    }
    text.customParams = {};
    text.customParams.x = x;
    text.customParams.y = y;

    // TODO do not hard code 'A', but get a good one
    text.text = 'A';
    text.style.font = 'bold 22pt Arial';
    text.style.fill = '#22f';
    this.texts.add(text);
    this.board[x][y] = text;
};

Board.clicked = function(button) {
    button.alpha = 0.7;
    this.currentWord.text += this.board[button.customParams.x][button.customParams.y].text;
};

Board.generateWordText = function() {
    this.currentWord = WB.game.add.text(this.SIZEX/2, 70);
    this.currentWord.anchor.setTo(0.5);
    this.currentWord.style.font = 'bold 30pt Arial';
    this.currentWord.style.fill = '#2f2';
    this.currentWord.text = '';
};

Board.createLetterPool = function() {
    this.letter_distribution = JSON.parse(WB.game.cache.getText('letters'));
    this.letter_pool = '';
    for (var l in this.letter_distribution) {
        for (var i = 0; i < this.letter_distribution[l].count; i++) {
            this.letter_pool += l;
        }
    }
};

WB.GameState.Board = Board;
