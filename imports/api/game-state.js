import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash'
import { ObjectID } from 'mongodb'

import { Games } from './games.js'
import { GameCards } from './game-cards.js'
import { Players } from './players.js'

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

  async initialize() {
    await this.initializeCards()
    Games.update(this.game, {$set: {initializedAt: new Date()}})
  }

  get gameId() { return this.game._id }
  get players() { return Players.find({gameId: this.gameId}).fetch() }

  async initializeCards() {
    const cards = this.generateCards()

    const handCount = 5
    const randomNumbers = this.randomNumbers(0, cards.length, this.players.length * handCount)

    this.players.forEach((p) => {
      _.range(handCount).forEach((n) => {
        const index = randomNumbers.pop()
        cards[index].owner = ObjectID(p._id.toHexString())
      })
    })

    await GameCards.rawCollection().insertMany(cards)
  }

  generateCards() {
    const cards = []
    const decks = [1, 2]

    decks.forEach((deck) => {
      SUITS.forEach((suit) => {
        CARD_NUMBERS.slice(0, 13).forEach((num) => {
          cards.push({deck, suit, num})
        })
      })

      cards.push({deck, suit: 'R', num: 'Jo'})
      cards.push({deck, suit: 'B', num: 'Jo'})
    })

    cards.forEach((c) => {
      // c.gameId = new Mongo.ObjectID(this.gameId.toHexString())
      c.gameId = ObjectID(this.gameId.toHexString())
      c.owner = 'D'
    })

    return cards
  }

  randomNumbers(start, endExclusive, length) {
    const numbers = new Set()

    while (numbers.size < length) {
      numbers.add(crypto.randomInt(start, endExclusive))
    }

    return Array.from(numbers)
  }
}


// Meteor.methods({
//   'gameState.takeAction' ({game}) {
//     if (!this.userId) { return 'not logged in' }
//   }
// })
