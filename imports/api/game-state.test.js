import { assert } from "chai";
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Games } from './games.js'
import { Players } from './players.js'
import { GameCards } from './game-cards.js'
import GameState from './game-state.js'

if (Meteor.isServer) {
  // TODO: unfuck mocharc
  describe('GameState', function () {
    beforeEach(function () {
      resetDatabase();
    });

    it('initial state', async function () {
      ({gameId, game, players, gameState} = await setupAndInitializeGame())

      assert.lengthOf(gameState.deck, 108)
      assert.deepInclude(gameState.deck, {num: '2', suit: 'C', deck: 0})
      assert.deepEqual(gameState.starts[3][4], {player: 3, peg: 4})
    })

    it('start', async function () {
      ({gameId, game, players, gameState} = await setupAndInitializeGame())
      gameState.start()

      assert.lengthOf(gameState.deck, 108 - (5 * 4))
      assert.lengthOf(gameState.hands[3], 5)
    })
  });
}

const setupAndInitializeGame = async function () {
  const gameId = Games.insert({numPlayers: 4})
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
  game = Games.findOne(gameId)

  return {gameId, game, players, gameState}
}

const assertDocumentEquality = function(a, b) {
  assert.equal(a._id.valueOf(), b._id.valueOf())
}
