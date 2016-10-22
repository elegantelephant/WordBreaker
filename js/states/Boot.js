var GameName = GameName || {};

GameName.BootState = GameName.BootState || {};

GameName.BootState.init = function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = '#aaa';
};

GameName.BootState.preload = function() {
        this.load.image('logo', 'assets/images/logo.png');
};          
            
GameName.BootState.create = function() {
        this.state.start('PreloadState');
};
