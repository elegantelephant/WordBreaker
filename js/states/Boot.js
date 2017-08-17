var WB = WB || {};

WB.BootState = WB.BootState || {};

WB.BootState.init = function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = '#aaa';
};

WB.BootState.preload = function() {
        this.load.image('logo', 'assets/images/logo.png');
};

WB.BootState.create = function() {
        this.state.start('PreloadState');
};
