import firebase from 'firebase';
import config from './config-override';
import getConfig from './config';

export default class DB {
    constructor () {
        //init firebase
        //firebase.initializeApp(getConfig(config).firebase);

        //this.database = firebase.database().ref();
        this.database = {} // DEBUG: mock database
    }

    addModel (key, className) {
        if ("function" !== typeof className) {
            throw "Supplied class is not a function";
        }

        this[key] = new className(this.database);
    }
}
