# new-phaser-project
My ongoing effort to create a nice starting point for Phaser.js games...

IMPORTANT! This report contains several dot files. Do not clone this repo and just do a simple cp over to a new repo or you will likey miss those files.

Instead try one of the following:
- download this project as zip file and unpack in your new repo
- import it with github
- fork the project

Supports:
- webpack, webpack dev server, es6 via babel

## Prereqs
- make
- Node.js - https://nodejs.org/en/

## Setup and running webpack dev server via make
- ```make start```

## Viewing to app
- In a browser, browse to localhost:8080. Note: if you already have a server on that port it will just increment, thanks to webpack dev server, so it might be 8081 instead.

## Optionally, you can install all dependancies via npm
- ```npm install```

## Optionally, you can start the webpack dev server using npm
- ```npm start```

## Creating a packaged distribution
- ```make dist``` or ```npm run dist```
