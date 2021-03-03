import { Meteor } from 'meteor/meteor';

import { Games } from './games.js'
import { GameCards } from './game-cards.js'

// enums would be nice 😠
const CARD_NUMBERS = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Ja', 'Q', 'K', 'A'
]

const SUITS = ['S', 'C', 'D', 'H']

export default class GameState {
  constructor(game) {
    this.game = game
  }

  initialize() {
    this.initializeCards()
    Games.update(this.game, {$set: {initializedAt: new Date()}})
  }

  get gameId() { return this.game._id }

  initializeCards() {
    const cards = []
    const decks = [1, 2]

    decks.forEach((deck) => {
      SUITS.forEach((suit) => {
        CARD_NUMBERS.slice(0, 13).forEach((num) => {
          cards.push({gameId: this.gameId, deck, suit, num})
        })
      })

      cards.push({gameId: this.gameId, deck, suit: 'R', num: 'Jo'})
      cards.push({gameId: this.gameId, deck, suit: 'B', num: 'Jo'})
    })

    GameCards.rawCollection().insertMany(cards)
  }
}

// Meteor.methods({
//   'gameState.takeAction' ({game}) {
//     if (!this.userId) { return 'not logged in' }
//   }
// })
