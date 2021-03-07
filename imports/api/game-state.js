import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash'
import { ObjectID } from 'mongodb'

import { Games } from './games.js'
import { Players } from './players.js'
import { GameEvents } from './game-events.js'

// enums would be nice 😠
const CARD_NUMBERS = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Ja', 'Q', 'K', 'A', 'Jo'
]

const SUITS = ['C', 'D', 'H', 'S']

export default class GameState {
  constructor(game, options = {}) {
    this.game = game
    this.deck = this.initializeDeck()
    this.starts = this.initializeStarts()

    if (options.rehydrate === true) {
      const gameEvents = this.fetchGameEvents()
      gameEvents.forEach((event) => this.applyEvent(event))
    }
  }

  get players() { return Players.find({gameId: this.gameId}).fetch() }
  get numPlayers() { return this.game.numPlayers }
  get gameId() { return this.game._id }

  start() {
    const deckClone = _.clone(this.deck)
    const hands = _.range(this.numPlayers).map(() => {
      return _.range(5).map(() => {
        return this.drawCard(deckClone)
      })
    })

    const eventId = GameEvents.insert({
      gameId: this.gameId,
      num: 0,
      name: 'start',
      hands
    })
    const event = GameEvents.findOne(eventId)

    this.applyEvent(event)
  }

  initializeDeck() {
    const cards = []
    const decks = _.range(this.numPlayers / 2)

    decks.forEach((deck) => {
      SUITS.forEach((suit) => {
        CARD_NUMBERS.slice(0, 13).forEach((num) => {
          cards.push({num, suit, deck})
        })
      })

      cards.push({num: CARD_NUMBERS[13], suit: 'R', deck})
      cards.push({num: CARD_NUMBERS[13], suit: 'B', deck})
    })

    return cards
  }

  initializeStarts() {
    return _.range(this.numPlayers).map((i) => {
      return _.range(5).map((j) => {
        return {player: i, peg: j}
      })
    })
  }

  randomNumbers(start, endExclusive, length) {
    const numbers = new Set()

    while (numbers.size < length) {
      numbers.add(crypto.randomInt(start, endExclusive))
    }

    return Array.from(numbers)
  }


  get lastAction() {
    return GameActions.findOne({gameId: this.gameId}, {sort: {num: -1}, limit: 1})
  }

  get currentPlayerNum() {
    if (!this.lastAction) { return 1 }
    const lastActionPlayer = Players.findOne({playerId: this.lastAction.playerId})

    return ((lastActionPlayer.num - 1 + 1) % this.numPlayers) + 1
  }

  get currentPlayer() {
    return Players.findOne({gameId: this.gameId, num: this.currentPlayerNum})
  }

  // NOTE: this does not work with Svelte's reactivity
  drawCard(deck) {
    const i = crypto.randomInt(this.deck.length)
    const card = deck.splice(i, 1) 

    return card
  }

  fetchGameEvents() {
    const gameEvents = GameEvents.find({gameId: this.gameId}, {sort: {num: 1}}).fetch()

    if (gameEvents[0].num != 0 || _.last(gameEvents).num != (gameEvents.length - 1)) {
      throw new Error('missing game events')
    }

    return gameEvents
  }

  applyEvent(event) {
    switch(event.name) {
      case 'start':
        this.applyStartEvent(event)
        break
      default:
        throw new Error('unhandled game event')
    }
  }

  applyStartEvent(event) {
    this.hands = event.hands
    const handCards = _.flatten(event.hands)

    handCards.forEach((card) => {
      const index = this.deck.indexOf(card)
      this.deck.splice(index, 1)
    })
  }
}
