import firebase from 'firebase';
import TextInputElement from '../prefabs/text-input-element';

export default class LoginState extends Phaser.State {
    init() {
        // init data
        this.prefabs    = {};
        this.login_data = this.game.cache.getJSON('login_data');

        ["email","password"].forEach((key) => {
            var prefab_data = this.login_data[key];

            var prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width,
                                                  prefab_data.position.y * this.game.world.height);

            this.prefabs[key] = new TextInputElement(this, key, prefab_position, prefab_data.properties);

            this.prefabs[key].onEnter.add(this.attempt_login, this);

            this.game.add.existing(this.prefabs[key]);
        });
    }

    attempt_login() {
        var email    = this.prefabs["email"].val();
        var password = this.prefabs["password"].val();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((function(user) {
                this.on_login(null, user);
            }).bind(this))
            .catch((function(error) {
                this.on_login(error)
            }).bind(this));
    }

    on_login(error, user) {
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
            this.game.db.player.setAuthedUser(user);

            this.game.db.player.info().then(this.save_player_data.bind(this));
        }
    }

    on_create_user(error, user_data) {
        var email    = this.prefabs["email"].val();
        var password = this.prefabs["password"].val();

        if (error) {
            this.reset_form();

            console.log(error.message + ' (' + error.code + ')');
        } else {
            this.attempt_login(email, password);
        }
    }

    save_player_data(snapshot) {
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

            this.game.db.player.setInfo({name: this.game.player_name, money: this.game.money, max_score: this.game.max_score});
        }

        this.reset_form();

        this.game.state.start("Home");
    }

    reset_form() {
        // clear inputs
        this.prefabs["email"].val('');
        this.prefabs["password"].val('');
    }

    shutdown() {
        ["email","password"].forEach((key) => {
            this.prefabs[key].onEnter.removeAll();
        });
    }
}
