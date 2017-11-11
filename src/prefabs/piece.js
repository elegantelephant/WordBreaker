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
        var moveTile;
        var	pixels = this.gameState.board.getPixelFromGrid(to.x, to.y);
        var from = {x: unit.gridx, y: unit.gridy};

        moveTile = this.game.add.tween(unit);
        moveTile.to({x: pixels[0], y: pixels[1]}, 400);
        // moveTile.onComplete.add(function() {});
        moveTile.start();
        this.gameState.board.board[to.x][to.y] = unit;
        unit.gridx = to.x;
        unit.gridy = to.y;
        delete this.gameState.board.board[from.x][from.y];
    }
}
