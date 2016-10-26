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
    this.tileSize = Math.floor(this.SIZEX / 8);
    var tile = {};
    this.texts = WB.game.add.group();

    for (var x = 0; x < cols; x++) {
        board[x] = []; 
        for (var y = 0; y < rows; y++) {
            pixel_x = (x + 1.5) * this.tileSize;
            pixel_y = (this.SIZEY) - (y + 1.5) * this.tileSize;

            tile = WB.game.add.sprite(pixel_x, pixel_y, 'letter_tile');
            tile.scale.setTo(this.tileSize / tile.width);
            tile.anchor.setTo(0.5);
            tile.customParams = {}; 
            tile.customParams.x = x;
            tile.customParams.y = y;

            text = this.texts.getFirstExists(false);
            if (!text) {
                text = WB.game.add.text(pixel_x, pixel_y);
                text.anchor.setTo(0.5);
            }
            text.customParams = {}; 
            text.customParams.x = x;
            text.customParams.y = y;
            text.text = 'A';

            console.log(text.y);

            text.style.font = 'bold 22pt Arial';
            text.style.fill = '#22f';
            this.texts.add(text);
            WB.game.world.bringToTop(this.texts);

            board[x][y] = text;
        }
    }   
};

WB.GameState.Board = Board;
