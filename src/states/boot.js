require('../../assets/images/logo.png');

export default class BootState extends Phaser.State {
    init() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.backgroundColor = '#aaa';
    }

    preload() {
        this.load.image('logo', this.game.global.asset_path + 'logo.png');
    }

    create() {
        this.state.start('Preload');
    }
}
