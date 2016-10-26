var WB = WB || {};

//initiate the Phaser framework
WB.game = new Phaser.Game(360, 640, Phaser.AUTO);

WB.game.state.add('BootState', WB.BootState);
WB.game.state.add('PreloadState', WB.PreloadState);
WB.game.state.add('HomeState', WB.HomeState);
WB.game.state.add('GameState', WB.GameState);
WB.game.state.start('BootState');

