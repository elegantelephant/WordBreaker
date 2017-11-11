// import states
import BootState from './states/boot';
import PreloadState from './states/preload';
import LoginState from './states/login';
import HomeState from './states/home';
import ShopState from './states/shop';
import LevelSelectorState from './states/level-selector';
import GameState from './states/game';

import DB from './db';
import PlayerModel from './db/player';
import AllPlayersModel from './db/all-players';

require('dotenv');
require('./index.html');

let game = new Phaser.Game(360, 640);

Phaser.Device.whenReady(function () {
    // plugins
    game.__plugins = game.__plugins || {};

    // add plugins here
    // ...

    // setup global namespace under game for our global data
    game.global = {};

    game.global.asset_path = '/assets/';

    // states
    game.state.add('Boot', BootState);
    game.state.add('Preload', PreloadState);
    game.state.add('Login', LoginState);
    game.state.add('Home', HomeState);
    game.state.add('Shop', ShopState);
    game.state.add('LevelSelector', LevelSelectorState);
    game.state.add('Game', GameState);

    game.db = new DB();
    game.db.addModel('player', PlayerModel);
    game.db.addModel('allPlayers', AllPlayersModel);

    game.state.start('Boot');
});
