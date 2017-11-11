export default class CancelBtn {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    createCancelBtn(callback) {
        this.GAME_WIDTH = this.game.world.width;
        this.GAME_HEIGHT = this.game.world.height;

        var btn = this.game.add.button(0 , this.GAME_HEIGHT / 9, 'cancel_button', callback, this.gameState);

        btn.anchor.setTo(0, 0); // Set anchor to the bottom/center
        btn.scale.setTo((this.GAME_WIDTH/btn.width)*0.5);
    }
}
