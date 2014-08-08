# Tractor

This is an experiment project which implements a popular Chinese card game called Tractor (拖拉机) or Upgrade (升级).


## Tech stack

### Generator
- [Yeoman](http://yeoman.io/)
- [generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack)

### Server side
- Node.js
- Express.js
- Jade
- MongoDB + Mongoose
- Passport.js

### Client side
- Angular
- Jade


## Prerequisite

### Node
    brew install node

### Grunt
    npm install -g grunt-cli

### Bower
    npm install -g bower

### MongoDB
    brew install mongodb
    mongod --config /usr/local/etc/mongod.conf

## Setup
    npm install
    bower install

## Run
    grunt serve

Make sure your `mongod` is running
