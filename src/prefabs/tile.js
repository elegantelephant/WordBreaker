export default class Tile {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    create(callback) {
        this.GAME_WIDTH = this.game.world.width;
        this.GAME_HEIGHT = this.game.world.height;

        var btn = this.game.add.button(this.GAME_WIDTH / 2 , this.GAME_HEIGHT / 9, 'submit_button', callback, gameState);

        btn.anchor.setTo(0, 0); // Set anchor to the bottom/center
        btn.scale.setTo((this.GAME_WIDTH/btn.width)*0.5);
    }
}
