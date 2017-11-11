require('../../assets/images/Play.png');
require('../../assets/images/Shop_Button.png');
require('../../assets/images/Level_Button.png');
require('../../assets/images/Gold_Button.png');
require('../../assets/images/Red_Button.png');
require('../../assets/images/Level_Icon.png');
require('../../assets/images/input_box.png');
require('../../assets/images/Submit_Button.png');
require('../../assets/images/Cancel_Button.png');
require('../../assets/images/MenuButton.png');
require('../../assets/images/ReplayArrow.png');
require('../../assets/images/ContinueArrow.png');

require('../../assets/data/words.txt');

import loginDataJSON from '../../assets/json/login.json';
import lettersJSON from '../../assets/json/letters.json';
import levelsJSON from '../../assets/json/levels.json';

export default class PreloadState extends Phaser.State {
    preload() {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);
        this.logo.width = this.game.world.width * 0.80;
        this.logo.height = this.game.world.width * 0.80;

        // monitor load completion to move to the next state
        this.load.onLoadComplete.add(this.loadComplete, this);

        // load images
        this.load.image('play_button',     this.game.global.asset_path + 'Play.png');
        this.load.image('shop_button',     this.game.global.asset_path + 'Shop_Button.png');
        this.load.image('green_tile',      this.game.global.asset_path + 'Level_Button.png');
        this.load.image('gold_tile',       this.game.global.asset_path + 'Gold_Button.png');
        this.load.image('red_tile',        this.game.global.asset_path + 'Red_Button.png');
        this.load.image('levels_button',   this.game.global.asset_path + 'Level_Icon.png');
        this.load.image('input_box_image', this.game.global.asset_path + 'input_box.png');
        this.load.image('submit_button',   this.game.global.asset_path + 'Submit_Button.png');
        this.load.image('cancel_button',   this.game.global.asset_path + 'Cancel_Button.png');
        this.load.image('menu',            this.game.global.asset_path + 'MenuButton.png');
        this.load.image('replay',          this.game.global.asset_path + 'ReplayArrow.png');
        this.load.image('continue',        this.game.global.asset_path + 'ContinueArrow.png');

        // store json in game cache
        this.game.cache.addJSON('login_data', null, loginDataJSON);
        this.game.cache.addJSON('letters', null, lettersJSON);
        this.game.cache.addJSON('levels', null, levelsJSON);
        this.load.text('wordsfile', this.game.global.asset_path + 'words.txt');
    }

    loadComplete() {
        //this.game.time.events.add(Phaser.Timer.SECOND, function() {
        this.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            this.state.start('Login');
            //this.game.state.start("Home"); // DEBUG: bypass login state for testing...
        }, this);
    }
}
