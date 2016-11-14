var WB = WB || {};
WB.GameState = WB.GameState || {};

var Piece = {};

Piece.create = function() {
};

Piece.rotate = function() {
};

Piece.move = function(unit, to) {
    var moveTile, moveText;
    var	pixels = WB.GameState.Board.getPixelFromGrid(to.x, to.y);
    var from = {x: unit.tile.gridx, y: unit.tile.gridy};

    moveTile = WB.GameState.game.add.tween(unit.tile);
    moveText = WB.GameState.game.add.tween(unit.text);
    moveTile.to({x: pixels[0], y: pixels[1]}, 400);
    moveText.to({x: pixels[0], y: pixels[1]}, 400);
    // moveTile.onComplete.add(function() {});
    moveTile.start();
    moveText.start();
    WB.GameState.Board.board[to.x][to.y] = unit; 
    unit.tile.gridx = to.x;
    unit.tile.gridy = to.y;
    WB.GameState.Board.board[from.x][from.y] = {}; 
};

WB.GameState.Piece = Piece;
