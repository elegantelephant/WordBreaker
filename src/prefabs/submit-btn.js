export default class SubmitBtn {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    createSubmitBtn(callback) {
        this.GAME_WIDTH = this.game.world.width;
        this.GAME_HEIGHT = this.game.world.height;

        var btn = this.game.add.button(this.GAME_WIDTH / 2 , this.GAME_HEIGHT / 9, 'submit_button', callback, this.gameState);

        btn.anchor.setTo(0, 0); // Set anchor to the bottom/center
        btn.scale.setTo((this.GAME_WIDTH/btn.width)*0.5);
    }
}
