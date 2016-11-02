var GULP       = require("gulp"),
    NODEMON    = require("gulp-nodemon");

//server related
GULP.task("serve", [], function() {
    return NODEMON({
        script: "server/index.js",
        ext: "js html",
        env: { "NODE_ENV": "development" }
    });
});

GULP.task("default", ['serve'], function() {});
