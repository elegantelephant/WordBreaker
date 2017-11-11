export default class Gold {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    create() {
        this.Gold = this.game.add.text(10, 0);
        this.Gold.text = 0;
        this.Gold.style.font = 'bold 20pt Arial';
        this.Gold.style.fill = "#FFD700";
    }

    add(goldadd) {
        this.Gold.text = +this.Gold.text + goldadd;
    }

    reset() {
        this.Gold.text = 0;
    }
}
