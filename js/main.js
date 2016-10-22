var GameName = GameName || {};

//initiate the Phaser framework
GameName.game = new Phaser.Game(360, 640, Phaser.AUTO);

GameName.game.state.add('BootState', GameName.BootState);
GameName.game.state.add('PreloadState', GameName.PreloadState);
GameName.game.state.add('HomeState', GameName.HomeState);
GameName.game.state.add('GameState', GameName.GameState);
GameName.game.state.start('BootState');

