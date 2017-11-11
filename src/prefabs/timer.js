const ONE_SECOND_IN_MILLISECONDS = 1000;
const ONE_MINUTE_IN_SECONDS = 60;

export default class Timer extends Phaser.Text {
    constructor(game, x, y) {
        super(game, x, y, '00:00', {font: '30px Arial', fill: '#fff'});

        // anchor in the top middle
        this.anchor.x = 0.5;
        this.anchor.y = 0;

        this.seconds = 0;
        this.minutes = 0;
        this.timeAccrued = 0;
        this.prevGetTimeVal = new Date().getTime();
    }

    update() {
        var timeNow = new Date().getTime();

        this.timeAccrued += (timeNow - this.prevGetTimeVal) / ONE_SECOND_IN_MILLISECONDS; // track time in seconds

        this.prevGetTimeVal = timeNow;

        this.tick();
    }

    tick() {
        if(this.timeAccrued >= 1) {
            this.seconds += parseInt(this.timeAccrued);

            if(this.seconds >= 60) {
                this.minutes++;
                this.seconds = 0;
            }

            this.text = ((this.minutes < 10) ? '0' + this.minutes : this.minutes) + ':' +
                        ((this.seconds < 10) ? '0' + this.seconds : this.seconds);

            this.timeAccrued = 0; // reset until next second that passes
        }
    }

    // return time in seconds
    getTime() {
        return this.minutes * ONE_MINUTE_IN_SECONDS + this.seconds;
    }
}
