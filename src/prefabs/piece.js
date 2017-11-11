export default class Piece {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    create() {
        // create
    }

    rotate() {
        // rotate
    }

    move(unit, to) {
        var moveTile, moveText;
        var	pixels = this.gameState.board.getPixelFromGrid(to.x, to.y);
        var from = {x: unit.tile.gridx, y: unit.tile.gridy};

        moveTile = this.game.add.tween(unit.tile);
        moveText = this.game.add.tween(unit.text);
        moveTile.to({x: pixels[0], y: pixels[1]}, 400);
        moveText.to({x: pixels[0], y: pixels[1]}, 400);
        // moveTile.onComplete.add(function() {});
        moveTile.start();
        moveText.start();
        this.gameState.board.board[to.x][to.y] = unit;
        unit.tile.gridx = to.x;
        unit.tile.gridy = to.y;
        this.gameState.board.board[from.x][from.y] = {};
    }
}
