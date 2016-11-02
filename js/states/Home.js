var WB = WB || {};

WB.HomeState = WB.HomeState || {};

WB.HomeState.init = function() {
    this.game.stage.backgroundColor = '#000';
};

WB.HomeState.preload = function() {
};        
            
WB.HomeState.create = function() {
    var button_width = this.game.width / 2;
    var button_height = this.game.height / 10;

    this.shopButton = this.add.button(this.game.width / 2, this.game.height * 2 / 6, 'shop_button', WB.HomeState.startShopState, this),
    this.shopButton.anchor.setTo(0.5);
    this.shopButton.scale.setTo(0.5);

    this.playButton = this.add.button(this.game.width / 2, this.game.height * 4 / 6, 'play_button', WB.HomeState.startGameState, this),
    this.playButton.anchor.setTo(0.5);
    this.playButton.scale.setTo(0.5);
};      
        
WB.HomeState.startGameState = function() {
    this.state.start('GameState');
};      

WB.HomeState.startShopState = function() {
    this.state.start('ShopState');
};      
