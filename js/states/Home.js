var GameName = GameName || {};

GameName.HomeState = GameName.HomeState || {};

GameName.HomeState.init = function() {
    this.game.stage.backgroundColor = '#000';
};

GameName.HomeState.preload = function() {
};        
            
GameName.HomeState.create = function() {
    var button_width = this.game.width / 2;
    var button_height = this.game.height / 10;
    this.playButton = this.add.button(this.game.width / 2, this.game.height * 4 / 6, 'play_button', GameName.HomeState.startGameState, this),
    this.playButton.anchor.setTo(0.5);
    this.playButton.scale.setTo(0.5);
};      
        
GameName.HomeState.startGameState = function() {
    this.state.start('GameState');
};      
