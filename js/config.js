var getConfig = (function() {
    "use strict";

    /*
        You can override any key in this config.
            1. Create the file js/config-override.js

            2. Add in the contents
                var config = {};

            3. define the keys inside that json object
    */

    // base configuraiton goes here
    var configBase = {
        "firebase": {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            storageBucket: "",
            messagingSenderId: ""
        }
    };

    if ("object" === typeof config) {
        for (var k in config) {
            configBase[k] = config[k];
        }
    }

    return function() {
        return configBase;
    };
})();
