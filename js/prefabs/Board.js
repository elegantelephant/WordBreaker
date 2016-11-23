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
    // WB.game.world.bringToTop(this.texts);
};

Board.generateGrid = function(rows, cols) {
    // WARNING: I am amaking this start from (0, 0)
    // being the BOTTOM left corner for my brain's sake
    var index = 0;
    this.tileSize = Math.floor(this.SIZEX / 8);
    this.texts = WB.game.add.group();
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows - 2; y++) {
            this.addTile(x, y);
        }
    }
};

Board.getPixelFromGrid = function(gridX, gridY) {
    var x = (gridX + 2) * this.tileSize;
    var y = (this.SIZEY) - (gridY + 1.5) * this.tileSize;
    return [x, y];
};

Board.addTile = function(x, y) {
    var pix = [];
    pix = this.getPixelFromGrid(x, y);
    tile = WB.game.add.button(pix[0], pix[1], 'letter_tile', Board.clicked, this);
    tile.scale.setTo(this.tileSize / tile.width);
    tile.anchor.setTo(0.5);
    tile.gridx = x;
    tile.gridy = y;
    this.board[x][y].tile = tile;
    this.addLetter(pix[0], pix[1], x, y);
};

Board.addLetter = function(pixX, pixY, x, y) {
    text = this.texts.getFirstExists(false);
    if (!text) {
        text = WB.game.add.text(pixX, pixY);
        text.anchor.setTo(0.5);
    }
    else {
        text.reset(pixX, pixY);
    }
    // Choose random letter from pool
    text.text = this.getRandomLetter();
    text.style.font = 'bold 22pt Arial';
    text.style.fill = '#22f';
    this.texts.add(text);
    this.board[x][y].text = text;
    WB.game.world.bringToTop(this.texts);

};

Board.getRandomLetter = function() {
    var randomNumber = Math.floor(Math.random() * this.letterPool.length);
    var letter = this.letterPool.charAt(randomNumber).toUpperCase();
    return letter;
};

Board.newPiece = function() {
    // Place tile 1
    var gridx = Math.floor(this.columns / 2) - 1;
    var gridy = this.rows - 1;
    var pixels = this.getPixelFromGrid(gridx, gridy);
    WB.GameState.Board.addTile(gridx, gridy);
    WB.GameState.Board.board[gridx][gridy].newPiece = true;

    // Place tile 2
    var gridLoc = this.newLocation(gridx, gridy);
    pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
    WB.GameState.Board.addTile(gridLoc.x, gridLoc.y);
    WB.GameState.Board.board[gridLoc.x][gridLoc.y].newPiece = true;

    // Place tile 3
    gridLoc = this.newLocation(gridLoc.x, gridLoc.y, gridLoc.dir);
    pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
    WB.GameState.Board.addTile(gridLoc.x, gridLoc.y);
    WB.GameState.Board.board[gridLoc.x][gridLoc.y].newPiece = true;

    // Place tile 4
    gridLoc = this.newLocation(gridLoc.x, gridLoc.y, gridLoc.dir);
    pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
    WB.GameState.Board.addTile(gridLoc.x, gridLoc.y);
    WB.GameState.Board.board[gridLoc.x][gridLoc.y].newPiece = true;

    WB.GameState.newTileDrop = true;
};

Board.newLocation = function(x, y, lastDir) {
    var directions;
    var newDir = false;
    console.log(typeof(lastDir));
    console.log(lastDir);
    if (typeof(lastDir) === 'undefined') {
        console.log(1);
        newDir = 'right';
    }
    else if (lastDir == 'right') {
        console.log(2);
        directions = ['down', 'right'];
    }
    else if (lastDir == 'down') {
        console.log(3);
        directions = ['down', 'right', 'left'];
    }
    else if (lastDir == 'left') {
        console.log(4);
        directions = ['down', 'left'];
    }
    console.log('directions: ' + directions);
    newDir = newDir || library.choose(directions);
    newDir == 'down' ? y--
        : newDir == 'up' ? y++
        : newDir == 'left' ? x--
        : newDir == 'right' ? x++
        : console.log("I have no idea which direction that is [" + newDir + "]");
    return {x: x, y: y, dir: newDir};
}

Board.findNewPiece = function() {
    var wholePiece = [];
    for (var col=0; col < this.columns; col++) {
        for (var row=0; row < this.rows; row++) {
            if (typeof(this.board[col][row].tile) !== 'undefined'
                   && this.board[col][row].newPiece) {
                wholePiece.push(this.board[col][row]);
            }
        }
    }
    return wholePiece;
};

Board.clicked = function(button) {
    var x = button.gridx;
    var y = button.gridy;

    // move the new piece around if that is where you clicked
    if (WB.GameState.newTileDrop) {
        return;
    }
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
        // SLOPPY: the newpiece remains the new piece until the next word submission
                this.board[col][row].newPiece = false;
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
    WB.GameState.newTileDrop = false;
};

Board.dropAbove = function(x, y) {
    var colToDrop = this.findAboveTiles(x, y);

    if (colToDrop.length) {
        colToDrop.forEach(function(unit, index) {
            WB.GameState.Piece.move(unit, {x: x, y: y + index});
        }, this);
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
    this.currentWord = WB.game.add.text(this.SIZEX/2, this.SIZEY/12);
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
