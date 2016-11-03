var WB = WB || {};

WB.TextInputElement = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);

    // track our game state containing this prefab
    this.game_state = game_state;

    // set names
    this.name            = name;
    this.text_input_name = name + "_input";

    // set input frame if available
    if (properties.frame) {
        this.frame = properties.frame;
    }

    // set input anchoring if available
    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }

    // set input width and height based on scale percentages if available
    if (properties.scale) {
        this.width  = this.game_state.game.world.width  * properties.scale.x;
        this.height = this.game_state.game.world.height * properties.scale.y;
    }

    // enable input for this sprite
    this.inputEnabled = true;

    // setup text input handler
    var text_input_pos = Object.create(this.position);
    text_input_pos.x = text_input_pos.x - this.width / 2;
    if (properties.text_offset) {
        text_input_pos.x += this.game_state.game.world.width * properties.text_offset.x;
        text_input_pos.y += this.game_state.game.world.height * properties.text_offset.y;
    }
    this.text_input = new WB.TextInput(this.game_state, this.text_input_name, text_input_pos, properties.text_properties);

    // sprite events
    this.events.onInputDown.add(this.onSelect, this);

    // text events
    this.onKeyPress = new Phaser.Signal();
    this.onEnter = new Phaser.Signal();
};

WB.TextInputElement.prototype = Object.create(Phaser.Sprite.prototype);
WB.TextInputElement.prototype.constructor = WB.TextInputElement;

WB.TextInputElement.prototype.onSelect = function () {
    "use strict";

    this.game_state.selected_text_input = this.text_input;

    // add text input into game (it's added on select so it stays on top of the input box image)
    this.game_state.game.add.existing(this.text_input);

    // blow away keyboard input events and replace with ours since we are selected
    this.game_state.game.input.keyboard.addCallbacks(this, null, this.onInput, null);
};

WB.TextInputElement.prototype.onInput = function(ev) {
    "use strict";

    var char    = ev.key;
    var keycode = ev.keyCode;

    this.onKeyPress.dispatch({ "char": char, "keycode": keycode });

    if (keycode >= Phaser.KeyCode.SPACEBAR && keycode <= Phaser.KeyCode.TILDE) { // ascii codes
        this.text_input.text += char;
    }
    else {
        switch (keycode) {
            case Phaser.KeyCode.ENTER:
                this.onEnter.dispatch();
                break;

            case Phaser.KeyCode.BACKSPACE:
                this.text_input.text = this.text_input.text.substring(0,this.text_input.text.length - 1);
                break;
        }
    }
};

WB.TextInputElement.prototype.val = function(value) {
    "use strict";

    if ("string" === typeof value) {
        this.text_input.text = value;
    }

    return this.text_input.text;
}
