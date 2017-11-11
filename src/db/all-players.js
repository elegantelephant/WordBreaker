export default class AllPlayersModel {
    constructor(database) {
        this.database = database
    }

    getHighScores (number_of_scores) {
        return this.database.child("players").orderByChild("max_score").limitToLast(number_of_scores);
    }
}
