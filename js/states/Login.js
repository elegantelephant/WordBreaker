var WB = WB || {};

WB.LoginState = Object.create(Phaser.State.prototype);

WB.LoginState.init = function() {
    // init data
    this.prefabs    = {};
    this.login_data = this.game.cache.getJSON('login_data');

    ["email","password"].forEach((function(key) {
        var prefab_data = this.login_data[key];

        var prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width,
                                              prefab_data.position.y * this.game.world.height);

        this.prefabs[key] = new WB.TextInputElement(this, key, prefab_position, prefab_data.properties);

        this.prefabs[key].onEnter.add(WB.LoginState.attempt_login, this);

        this.game.add.existing(this.prefabs[key]);
    }).bind(this));
};

WB.LoginState.preload = function() {
    // load assets
};

WB.LoginState.create = function() {
};

WB.LoginState.startGameState = function() {
};


WB.LoginState.attempt_login = function () {
    "use strict";
    var email    = this.prefabs["email"].val();
    var password = this.prefabs["password"].val();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((function(user) {
            this.on_login(null, user);
        }).bind(this))
        .catch((function(error) {
            this.on_login(error)
        }).bind(this));
};

WB.LoginState.on_login = function (error, user) {
    "use strict";
    var email    = this.prefabs["email"].val();
    var password = this.prefabs["password"].val();

    if (error) {
        if (error.code === "auth/user-not-found") {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((function(user) {
                    this.on_create_user(null,user);
                }).bind(this))
                .catch((function(error) {
                    this.on_create_user(error,null);
                }).bind(this));
        }
        else {
            this.reset_form();

            console.log(error.message + ' (' + error.code + ')');
        }
    } else {
        db.player.setAuthedUser(user);

        db.player.info().then(this.save_player_data.bind(this));
    }
};

WB.LoginState.on_create_user = function (error, user_data) {
    "use strict";
    var email    = this.prefabs["email"].val();
    var password = this.prefabs["password"].val();

    if (error) {
        this.reset_form();

        console.log(error.message + ' (' + error.code + ')');
    } else {
        this.attempt_login(email, password);
    }
};

WB.LoginState.save_player_data = function (snapshot) {
    "use strict";
    var email    = this.prefabs["email"].val();
    var password = this.prefabs["password"].val();

    var player_data;
    player_data = snapshot.val();

    if (player_data) {
        this.game.player_name = player_data.name;
        this.game.money = player_data.money;
        this.game.max_score = player_data.max_score;
    } else {
        this.game.player_name = email.replace(/@.*/, '');
        this.game.money = 0;
        this.game.max_score = 0;

        db.player.setInfo({name: this.game.player_name, money: this.game.money, max_score: this.game.max_score});
    }

    this.reset_form();

    this.game.state.start("HomeState");
};

WB.LoginState.reset_form = function() {
    "use strict";

    // clear inputs
    this.prefabs["email"].val('');
    this.prefabs["password"].val('');
};
