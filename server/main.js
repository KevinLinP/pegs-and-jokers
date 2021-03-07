import { Meteor } from 'meteor/meteor';
import { Players } from '../imports/api/players.js'
import { GameEvents } from '../imports/api/game-events.js'

Migrations.add({
  version: 1,
  up: function() {
    Players.rawCollection().createIndex({gameId: 1, color: 1}, {unique: true})
    Players.rawCollection().createIndex({gameId: 1, name: 1}, {unique: true})
    Players.rawCollection().createIndex({gameId: 1, num: 1}, {unique: true})

    GameEvents.rawCollection().createIndex({gameId: 1}) // TODO: is this needed?
    GameEvents.rawCollection().createIndex({gameId: 1, num: 1}, {unique: true})
    GameEvents.rawCollection().createIndex({gameId: 1, num: -1}, {unique: true})
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
