export default class Score {
    constructor(game, gameState) {
        this.game = game;
        this.gameState = gameState;
    }

    create() {
        this.Score = this.game.add.text(this.game.world.width - 10, 0);
        this.Score.anchor.setTo(1,0);
        this.Score.text = 0;
        this.Score.style.font = 'bold 20pt Arial';
        this.Score.style.fill = "#fff";
        this.Score.text = 0;
    };

    add(scoreadd) {
        this.Score.text = +this.Score.text + scoreadd;
    }

    reset() {
        this.Score.text = 0;
    }
}
