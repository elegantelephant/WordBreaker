var CLASS_NAMES = {
    gold: 'gold_tile',
    red: 'red_tile',
};
var DEFAULT_CLASS_NAME = 'green_tile';

export default class Tile extends Phaser.Group {
    constructor(board, gridx, gridy, pixel_x, pixel_y, special) {
        super(board.game);

        // initial data
        this.board = board;
        this.pixel_x = pixel_x;
        this.pixel_y = pixel_y;
        this.special = special;

        // TODO: get rid of these, currently still needed by piece movements in game.js
        this.gridx = gridx;
        this.gridy = gridy;

        this.create();
    }

    create() {
        this.button = this.addButton();
        this.text = this.addText();
    }

    addButton() {
        if (this.special && CLASS_NAMES[this.special]) {
            this.board.killSelectedLetters(this.gridx, this.gridy);
        } else if (this.special) {
            console.log(this.special + ' is not accounted for yet');
        }

        var class_name = CLASS_NAMES[this.special] || DEFAULT_CLASS_NAME;
        var button = this.add(this.board.game.add.button(this.pixel_x, this.pixel_y, class_name, this.board.clicked, this.board));

        button.scale.setTo(this.board.tileSize / button.width);
        button.anchor.setTo(0.5);

        // TODO: get rid of these
        button.gridx = this.gridx;
        button.gridy = this.gridy;

        return button;
    }

    addText() {
        var text = this.add(this.board.game.add.text(this.pixel_x, this.pixel_y));
        text.anchor.setTo(0.5);

        // Choose random letter from pool
        text.text = this.getRandomLetter();
        text.style.font = 'bold 22pt Arial';
        text.style.fill = '#22f';

        return text;
    }

    getRandomLetter() {
        var randomNumber = Math.floor(Math.random() * this.board.letterPool.length);
        var letter = this.board.letterPool.charAt(randomNumber).toUpperCase();
        return letter;
    }

    kill() {
        if (this.button) { this.button.kill(); }
        if (this.text) { this.text.kill(); }
    }
}
