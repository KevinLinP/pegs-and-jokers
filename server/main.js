import { Meteor } from 'meteor/meteor';
import { Players } from '../imports/api/players.js'
import { GameCards } from '../imports/api/game-cards.js'

Migrations.add({
  version: 1,
  up: function() {
    Players.rawCollection().createIndex({gameId: 1, color: 1}, {unique: true})
    Players.rawCollection().createIndex({gameId: 1, name: 1}, {unique: true})

    GameCards.rawCollection().createIndex({gameId: 1, owner: 1})
    GameCards.rawCollection().createIndex({gameId: 1, deck: 1, suit: 1, num: 1}, {unique: true})
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
