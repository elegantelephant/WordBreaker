var WB = WB || {};
WB.GameState = WB.GameState || {};

var Board = {};

Board.create = function(level) {
    this.SIZEX = WB.game.world.width;
    this.SIZEY = WB.game.world.height;
    this.rows = 9;
    this.columns = 5;

    // create and initialize the tiles structure
    this.board = Array(this.columns);
    for (var col = 0; col < this.columns; col ++) {
        this.board[col] = Array(this.rows);
        for (var row = 0; row < this.rows; row ++) {
            this.board[col][row] = {};
            this.board[col][row].selected = 0;
        }
    }

    Board.createLetterPool();
    Board.generateGrid(this.rows, this.columns);
    Board.generateWordText();
    Board.loadDictionary();
    WB.game.world.bringToTop(this.texts);
};

Board.generateGrid = function(rows, cols) {
    var index = 0;
    var pixel_x;
    var pixel_y;
    this.tileSize = Math.floor(this.SIZEX / 8);
    this.texts = WB.game.add.group();
    for (var x = 0; x < cols; x++) {
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
    tile.gridx = x;
    tile.gridy = y;
    this.board[x][y].tile = tile;
    
};

Board.addLetter = function(pixX, pixY, x, y) {
    text = this.texts.getFirstExists(false);
    if (!text) {
        text = WB.game.add.text(pixX, pixY);
        text.anchor.setTo(0.5);
    }

    // Choose random letter from pool
    text.text = this.letterPool.charAt(Math.floor(Math.random() * this.letterPool.length)).toUpperCase();
    text.style.font = 'bold 22pt Arial';
    text.style.fill = '#22f';
    this.texts.add(text);
    this.board[x][y].text = text;
};

Board.clicked = function(button) {
    var x = button.gridx;
    var y = button.gridy;
    if (! this.board[x][y].selected
       && (typeof this.prevx === 'undefined'
         || ((Math.abs(x - this.prevx) < 2
           && Math.abs(y - this.prevy) < 2))
         )
       ) {
        button.alpha = 0.7;
        this.prevx = x;
        this.prevy = y;
        this.board[x][y].selected = 1;
        this.currentWord.text += this.board[button.gridx][button.gridy].text.text;
    }
};

Board.deselectAll = function() {
    for (var col=0; col < this.columns; col++) {
        for (var row=0; row < this.rows; row++) {
            this.board[col][row].tile.alpha = 1.0;
            this.board[col][row].selected = 0;
        }
    }
    delete this.prevx;
    delete this.prevy;
}

Board.generateWordText = function() {
    this.currentWord = WB.game.add.text(this.SIZEX/2, 70);
    this.currentWord.anchor.setTo(0.5);
    this.currentWord.style.font = 'bold 30pt Arial';
    this.currentWord.style.fill = '#2f2';
    this.currentWord.text = '';
};

Board.createLetterPool = function() {
    this.letterDistribution = JSON.parse(WB.game.cache.getText('letters'));
    //this.letterDistribution = WB.game.cache.getJSON('letters');
    this.letterPool = '';
    for (var l in this.letterDistribution) {
        for (var i = 0; i < this.letterDistribution[l].count; i++) {
            this.letterPool += l;
        }
    }
};

Board.loadDictionary = function() {
    this.wordsText = WB.game.cache.getText('wordsfile');
};

WB.GameState.Board = Board;
