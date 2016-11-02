var WB = WB || {};
WB.GameState = WB.GameState || {};

var Board = {};

Board.createBoard = function(level) {
    this.SIZEX = WB.game.world.width;
    this.SIZEY = WB.game.world.height;
    var rows = 9;
    var columns = 5;

    Board.createLetterPool();
    Board.generateGrid(rows, columns);
    Board.generateWordText();
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

    // Choose random letter from pool
    text.text = this.letterPool.charAt(Math.floor(Math.random() * this.letterPool.length)).toUpperCase();
    text.style.font = 'bold 22pt Arial';
    text.style.fill = '#22f';
    this.texts.add(text);
    this.board[x][y] = text;
};

Board.clicked = function(button) {
    var x = button.customParams.x;
    var y = button.customParams.y;
    this.selected = this.selected || [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
        ];
    if (! this.selected[x][y]
       && (!this.prevx
         || ((Math.abs(x - this.prevx) < 2
           && Math.abs(y - this.prevy) < 2))
         )
       ) {
        button.alpha = 0.7;
        this.prevx = x;
        this.prevy = y;
        this.selected[x][y] = 1;
        this.currentWord.text += this.board[button.customParams.x][button.customParams.y].text;
    }
};

Board.generateWordText = function() {
    this.currentWord = WB.game.add.text(this.SIZEX/2, 70);
    this.currentWord.anchor.setTo(0.5);
    this.currentWord.style.font = 'bold 30pt Arial';
    this.currentWord.style.fill = '#2f2';
    this.currentWord.text = '';
};

Board.createLetterPool = function() {
    this.letterDistribution = JSON.parse(WB.game.cache.getText('letters'));
    this.letterPool = '';
    for (var l in this.letterDistribution) {
        for (var i = 0; i < this.letterDistribution[l].count; i++) {
            this.letterPool += l;
        }
    }
};

WB.GameState.Board = Board;
