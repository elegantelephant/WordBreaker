export default class PlayerModel {
    constructor(database) {
        this.database = database;
    }

    getAuthedUser() {
        return this.user;
    }

    setAuthedUser(currentUser) {
        if ("object" !== typeof currentUser || ! currentUser.uid) {
            throw "Invalid user";
        }

        this.user = currentUser;

        return this.user;
    }

    isAuthed() {
        return this.user ? true : false;
    }

    uid() {
        if (! this.isAuthed()) {
            throw "User not authed";
        }

        return this.getAuthedUser().uid;
    }

    ref() {
        return this.database.child("players").child(this.uid());
    }

    info() {
        return this.database.child("players").child(this.uid()).once("value");
    }

    setInfo() {
        return this.database.child("players").child(this.uid()).set(data);
    }
}
