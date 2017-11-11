export default class HomeState extends Phaser.State {
    init() {
        this.game.stage.backgroundColor = '#000';
    }

    create() {
        var button_width = this.game.width / 2;
        var button_height = this.game.height / 10;

        this.shopButton = this.add.button(this.game.width / 2, this.game.height * 2 / 6, 'shop_button', this.startShopState, this),
        this.shopButton.anchor.setTo(0.5);
        this.shopButton.scale.setTo(0.5);

        this.levelsButton = this.add.button(this.game.width / 2, this.game.height * 3 / 6, 'levels_button', this.startLevelSelectorState, this),
        this.levelsButton.anchor.setTo(0.5);
        this.levelsButton.scale.setTo(0.5);

        this.playButton = this.add.button(this.game.width / 2, this.game.height * 4 / 6, 'play_button', this.startGameState, this),
        this.playButton.anchor.setTo(0.5);
        this.playButton.scale.setTo(0.5);
    }

    startGameState() {
        this.state.start('Game');
    }

    startLevelSelectorState() {
        this.state.start('LevelSelector');
    }

    startShopState() {
        this.state.start('Shop');
    }
}
