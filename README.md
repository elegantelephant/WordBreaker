# Word Breaker
Place letters on the board and find words among them

## Setting up your Firebase API credentials

### Setup a Firebase account and project

1. Browse to firebase.google.com
2. *Sign in* using an existing gmail account
3. Click *Go To Console* in the top right to get to your firebase console.
4. Click create new project, and choose a name
5. This should bring you to the project overview page

### Setting up your firebase API credentials in config-override.js

1. Copy js/config-override.js.sample to js/config-override.js
2. Add in config json scaffolding like the following:
```javascript
var config = {
    "firebase": {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        storageBucket: "",
        messagingSenderId: ""
    }
};
```
3. In your firebase project overview page click *Add Firebase to your web app*
4. This will bring up a overlay with you api information. Firebase stores the keys directly to a config variable, however you will want to copy / paste the key: value pairs into your config-override until the *firebase* key.
5. After your config-override.js should look something like:
```javascript
var config = {
    "firebase": {
        apiKey: "RandomHashStringHere",
        authDomain: "yourproject.firebaseapp.com",
        databaseURL: "https://yourproject.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "0000000000000"
    }
};
```
7. Back on the firebase console click on *Authentication* in the side nav and choose the *Sign-In Method* tab.
8. Enaable Email / Password authentication
9. Now you should be able to work with firebase via the js/db/* model files!

## Notes
We have the list of possible words from http://www-personal.umich.edu/~jlawler/wordlist
