const ACHIEVEMENT_SPEED = 'achievement-speed';
const ACHIEVEMENT_MOVES = 'achievement-moves';
const ACHIEVEMENT_SCORE = 'achievement-score';

export default class AchievementMonitor {
    checkForAchievements(levelData = {}, levelStats = {}) {
        var achievements = [];

        if (
            'undefined' !== typeof(levelStats.time) &&
            'undefined' !== typeof(levelData.speedAchievementSeconds) &&
            (levelStats.time * 1) < (levelData.speedAchievementSeconds * 1)
        ) {
            achievements.push(ACHIEVEMENT_SPEED);
        }

        return achievements;
    }

    listAchievements() {
        return [
            ACHIEVEMENT_SPEED,
            ACHIEVEMENT_MOVES,
            ACHIEVEMENT_SCORE
        ];
    }
}
