import Tile from '../prefabs/tile';

export default class Board {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    create(levelData) {
        this.SIZEX = this.game.world.width;
        this.SIZEY = this.game.world.height;
        this.rows = levelData.rows;
        this.columns = levelData.columns;
        if (levelData.winCondition.gold) {
            this.goldenTiles = levelData.winCondition.gold.tiles;
        }

        // create and initialize the tiles structure
        this.board = Array(this.columns);
        for (var col = 0; col < this.columns; col ++) {
            this.board[col] = Array(this.rows);
        }

        this.createLetterPool();
        this.generateGrid();
        this.generateWordText();
        this.loadDictionary();
        // this.game.world.bringToTop(this.texts);
    }

    generateGrid() {
        // WARNING: I am making this start from (0, 0)
        // being the BOTTOM left corner for my brain's sake
        var index = 0;
        this.tileSize = Math.floor(this.SIZEX / (this.columns + 3));
        this.tiles = this.game.add.group();
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows - 5; y++) {
                this.addTile(x, y, false);
            }
        }
        if (this.goldenTiles) {
            this.goldenTiles.forEach(function(pos) {
                this.addTile(pos[0], pos[1], 'gold');
            }, this);
        }
    }

    getPixelFromGrid(gridX, gridY) {
        var x = (gridX + 2) * this.tileSize;
        var y = (this.SIZEY) - (gridY + 1.5) * this.tileSize;
        return [x, y];
    }

    addTile(x, y, special) {
        var pix = this.getPixelFromGrid(x, y);

        if (special) {
            this.killSelectedLetters(x, y);
        }
        this.board[x][y] = new Tile(this, x, y, pix[0], pix[1], special);
        this.tiles.add(this.board[x][y]);
    }

    newPiece() {
        // Place tile 1
        var gridx = Math.floor(this.columns / 2) - 1;
        var gridy = this.rows - 1;
        var pixels = this.getPixelFromGrid(gridx, gridy);
        this.addTile(gridx, gridy, false);
        this.board[gridx][gridy].newPiece = true;

        // Place tile 2
        var gridLoc = this.newLocation(gridx, gridy);
        pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
        this.addTile(gridLoc.x, gridLoc.y, false);
        this.board[gridLoc.x][gridLoc.y].newPiece = true;

        // Place tile 3
        gridLoc = this.newLocation(gridLoc.x, gridLoc.y, gridLoc.dir);
        pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
        this.addTile(gridLoc.x, gridLoc.y, false);
        this.board[gridLoc.x][gridLoc.y].newPiece = true;

        // Place tile 4
        gridLoc = this.newLocation(gridLoc.x, gridLoc.y, gridLoc.dir);
        pixels = this.getPixelFromGrid(gridLoc.x, gridLoc.y);
        this.addTile(gridLoc.x, gridLoc.y, false);
        this.board[gridLoc.x][gridLoc.y].newPiece = true;

        this.gameState.newTileDrop = true;
    }

    newLocation(x, y, lastDir) {
        var directions;
        var newDir = false;
        if (typeof(lastDir) === 'undefined') {
            newDir = 'right';
        }
        else if (lastDir == 'right') {
            directions = ['down', 'right'];
        }
        else if (lastDir == 'down') {
            directions = ['down', 'right', 'left'];
        }
        else if (lastDir == 'left') {
            directions = ['down', 'left'];
        }
        newDir = newDir || this.gameState.library.choose(directions);
        newDir == 'down' ? y--
            : newDir == 'up' ? y++
            : newDir == 'left' ? x--
            : newDir == 'right' ? x++
            : console.log("I have no idea which direction that is [" + newDir + "]");
        return {x: x, y: y, dir: newDir};
    }

    findNewPiece() {
        var wholePiece = [];
        for (var col=0; col < this.columns; col++) {
            for (var row=0; row < this.rows; row++) {
                var tile = this.board[col][row];
                if (tile && tile.newPiece) { wholePiece.push(tile) }
            }
        }
        return wholePiece;
    }

    clicked(button) {
        var x = button.tile.gridx;
        var y = button.tile.gridy;

        // move the new piece around if that is where you clicked
        if (this.gameState.newTileDrop) {
            return;
        }

        var tile = this.board[x][y];
        if (! tile.selected
           && (typeof this.prevx === 'undefined'
             || ((Math.abs(x - this.prevx) < 2
               && Math.abs(y - this.prevy) < 2))
             )
           ) {

            this.prevx = x;
            this.prevy = y;

            tile.select();
            this.currentWord.text += tile.text.text;
        }
    }

    deselectAll() {
        for (var col=0; col < this.columns; col++) {
            for (var row=0; row < this.rows; row++) {
                var tile = this.board[col][row];

                if (tile) { tile.unselect(); }
            }
        }
        delete this.prevx;
        delete this.prevy;
    }

    killSelectedLetters(x, y) {
        if (x && y) {
            var tile = this.board[x][y];
            if (tile) {
                tile.kill();
                delete this.board[x][y];
            }
        }
        else {
            for (var col=0; col < this.columns; col++) {
                for (var row=0; row < this.rows; row++) {
                    var tile = this.board[col][row];
                    if (tile && tile.selected) {
                        tile.kill();
                        delete this.board[col][row];
                    }
                }
            }
        }
    }

    letterFall() {
        var self = this;

        self.board.forEach(function(column, x) {
            for (var y = 0; y < column.length; y++) {
                var tile = column[y];
                if (! tile) {
                    self.dropAbove(x, y);
                    break;
                }
            }
        });
        this.gameState.newTileDrop = false;
        this.gameState.checkLose();
    }

    dropAbove(x, y) {
        var colToDrop = this.findAboveTiles(x, y);

        if (colToDrop.length) {
            colToDrop.forEach(function(unit, index) {
                this.gameState.piece.move(unit, {x: x, y: y + index});
            }, this);
        }
    }

    findAboveTiles(x, y) {
        var floating = [];
        for (var pos=y + 1; pos < this.rows; pos++) {
            var tile = this.board[x][pos];
            if (tile) { floating.push(tile) }
        }
        console.log(x, y, 'found', floating);
        return floating;
    }

    generateWordText() {
        this.currentWord = this.game.add.text(this.SIZEX/2, this.SIZEY/12);
        this.currentWord.anchor.setTo(0.5);
        this.currentWord.style.font = 'bold 30pt Arial';
        this.currentWord.style.fill = '#2f2';
        this.currentWord.text = '';
    }

    createLetterPool() {
        this.letterDistribution = this.game.cache.getJSON('letters');
        this.letterPool = '';
        for (var l in this.letterDistribution) {
            for (var i = 0; i < this.letterDistribution[l].count; i++) {
                this.letterPool += l;
            }
        }
    }

    loadDictionary() {
        this.wordsText = this.game.cache.getText('wordsfile');
    }
}
