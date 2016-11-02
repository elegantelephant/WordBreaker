function PlayerModel (database) {
    "use strict";

    this.database = database;
};

PlayerModel.prototype.getAuthedUser = function () {
    "use strict";

    return this.user;
};

PlayerModel.prototype.setAuthedUser = function (currentUser) {
    "use strict";

    if ("object" !== typeof currentUser || ! currentUser.uid) {
        throw "Invalid user";
    }

    this.user = currentUser;

    return this.getAuthedUser();
};

PlayerModel.prototype.isAuthed = function () {
    "use strict";

    return this.user ? true : false;
};

PlayerModel.prototype.uid = function () {
    "use strict";

    if (! this.isAuthed()) {
        throw "User not authed";
    }

    return this.getAuthedUser().uid;
};

PlayerModel.prototype.ref = function () {
    "use strict";

    return this.database.child("players").child(this.uid());
};

PlayerModel.prototype.info = function (data) {
    "use strict";

    return this.database.child("players").child(this.uid()).once("value");
};

PlayerModel.prototype.setInfo = function (data) {
    "use strict";

    return this.database.child("players").child(this.uid()).set(data);
};
