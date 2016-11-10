var WB = WB || {};
WB.GameState = WB.GameState || {};

var Board = {};

Board.create = function(rows, columns, level) {
    this.SIZEX = WB.game.world.width;
    this.SIZEY = WB.game.world.height;
    this.rows = rows;
    this.columns = columns;

    // create and initialize the tiles structure
    this.board = Array(this.columns);
    for (var col = 0; col < this.columns; col ++) {
        this.board[col] = Array(this.rows);
        for (var row = 0; row < this.rows; row ++) {
            this.board[col][row] = {};
            this.board[col][row].selected = false;
        }
    }

    this.createLetterPool();
    this.generateGrid(rows, columns);
    this.generateWordText();
    this.loadDictionary();
    WB.game.world.bringToTop(this.texts);
};

Board.generateGrid = function(rows, cols) {
    // WARNING: I am amaking this start from (0, 0)
    // being the BOTTOM left corner for my brain's sake
    var index = 0;
    var pixels = [];
    this.tileSize = Math.floor(this.SIZEX / 8);
    this.texts = WB.game.add.group();
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            pixels = this.getPixelFromGrid(x, y);
            this.addTile(pixels[0], pixels[1], x, y);
            this.addLetter(pixels[0], pixels[1], x, y);
        }
    }
};

Board.getPixelFromGrid = function(gridX, gridY) {
    var x = (gridX + 1.5) * this.tileSize;
    var y = (this.SIZEY) - (gridY + 1.5) * this.tileSize;
    return [x, y];
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
        this.board[x][y].selected = true;
        this.currentWord.text += this.board[button.gridx][button.gridy].text.text;
    }
};

Board.deselectAll = function() {
    for (var col=0; col < this.columns; col++) {
        for (var row=0; row < this.rows; row++) {
            if (typeof(this.board[col][row].tile) !== 'undefined') {
                this.board[col][row].tile.alpha = 1.0;
                this.board[col][row].selected = false;
            }
        }
    }
    delete this.prevx;
    delete this.prevy;
}

Board.killSelectedLetters = function() {
    for (var col=0; col < this.columns; col++) {
        for (var row=0; row < this.rows; row++) {
            if (this.board[col][row].selected) {
                this.board[col][row].text.kill();
                this.board[col][row].tile.kill();
                this.board[col][row].selected = false;
            }
        }
    }
};

Board.letterFall = function() {
    var self = this;

    self.board.forEach(function(column, x) {
        for (y = 0; y < column.length; y++) {
            if (typeof(column[y].tile) == 'undefined'
                || !column[y].tile._exists) {
                self.dropAbove(x, y);
                break;
            }
        }
    }); 
};

Board.dropAbove = function(x, y) {
    var colToDrop = this.findAboveTiles(x, y);
    var pixels= [];

    if (colToDrop.length) {
        colToDrop.forEach(function(unit, index) {
            unit.tile.gridx = x;
            unit.tile.gridy = y + index;
            pixels = this.getPixelFromGrid(x, y + index);
            unit.tile.x = unit.text.x = pixels[0];
            unit.tile.y = unit.text.y = pixels[1];
            this.board[x][y+index] = unit; 
            // tween it down
        }, this);
        //TODO find a way to kill the spots created by falling letters
        for (h = y + colToDrop.length; h < this.board[x].length; h++) {
            this.board[x][h] = {};
        }
    }
};

Board.findAboveTiles = function(x, y) {
    var floating = [];
    for (var pos=y + 1; pos < this.rows; pos++) {
        if (typeof(this.board[x][pos].tile) !== 'undefined' 
                && this.board[x][pos].tile._exists) {
            floating.push(this.board[x][pos]);
        }
    }
    return floating;
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
