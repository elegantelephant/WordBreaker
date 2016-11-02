function DB () {
    "use strict";

    //init firebase
    firebase.initializeApp(getConfig().firebase);

    this.database = firebase.database().ref();
};

DB.prototype.addModel = function(key, className) {
    "use strict";

    if ("function" !== typeof className) {
        throw "Supplied class is not a function";
    }

    this[key] = new className(this.database);
};
