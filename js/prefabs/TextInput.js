var WB = WB || {};

WB.TextInput = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text, properties.style);

    this.game_state = game_state;

    this.name = name;

    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }
};

WB.TextInput.prototype = Object.create(Phaser.Text.prototype);
WB.TextInput.prototype.constructor = WB.TextInput;
