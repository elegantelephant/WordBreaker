var WB = WB || {};
WB.GameState = WB.GameState || {};

var Board = {};

Board.createBoard = function(level) {
    this.SIZEX = WB.game.world.width;
    this.SIZEY = WB.game.world.height;
	var rows = 9;
	var cols = 5;
    var board = [];
	var index = 0;
    var pixel_x;
    var pixel_y;
    this.TileSize = Math.floor(this.SIZEX / 10);
    var tile = {};
    this.texts = Board.add.group();

    for (var x = 0; x < cols; x++) {
        board[x] = []; 
        for (var y = 0; y < rows; y++) {
            pixel_x = (x + 0.5) * this.tileSize;
            pixel_y = (this.SIZEY) + (y + 0.5) * this.tileSize;
            text = this.texts.getFirstExists(false);
            tile = WB.game.add.sprite(pixel_x, pixel_y, 'letter_tile');
            tile.scale.setTo(this.TileSize / tile.width);
            tile.anchor.setTo(0.5);
            tile.customParams = {}; 
            tile.customParams.x = x;
            tile.customParams.y = y;

            if (!text) {
                text = this.add.text(pixel_x, pixel_y);
                this.texts.add(text);
                text.anchor.setTo(0.5);
            }
            text.customParams = {}; 
            text.customParams.x = x;
            text.customParams.y = y;
            // text.text = this.choices[index];
            text.text = 'A';
            text.style.font = 'bold 25pt Arial';
            text.style.fill = '#fff';

            this.board[x][y] = text;
            index++;
        }
    }   

};

WB.GameState.Board = Board;
