import { assert } from "chai";
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Games } from './games.js'
import { Players } from './players.js'
import { GameCards } from './game-cards.js'
import GameState from './game-state.js'

if (Meteor.isServer) {
  describe('GameState', function () {
    beforeEach(function () {
      resetDatabase();
    });

    it('initializes', function () {
      const gameId = Games.insert({})
      let game = Games.findOne(gameId)

      const players = [
        {name: 'Alfa', num: 1},
        {name: 'Bravo', num: 2},
        {name: 'Charlie', num: 3},
        {name: 'Delta', num: 4},
      ]

      players.forEach((playerData) => {
        Players.insert(Object.assign({}, playerData, {gameId}))
      })

      const gameState = new GameState(game)
      gameState.initialize()
      game = Games.findOne(gameId)
      player = Players.findOne({gameId})

      // console.log(GameCards.findOne())

      assert.isNotNull(game.initializedAt)
      assert.equal(GameCards.find({gameId}).count(), 54 * 2)
      assert.equal(GameCards.find({gameId, owner: 'D'}).count(), (54 * 2) - 20)
      assert.equal(GameCards.find({gameId, owner: player._id}).count(), 5)
    })
  });
}
