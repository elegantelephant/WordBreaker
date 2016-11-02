function AllPlayersModel (database) {
    "use strict";

    this.database = database;
};

AllPlayersModel.prototype.getHighScores = function (number_of_scores) {
    "use strict";

    return this.database.child("players").orderByChild("max_score").limitToLast(number_of_scores);
};
