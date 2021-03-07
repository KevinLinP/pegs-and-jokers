import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash'
import { ObjectID } from 'mongodb'

import { Games } from './games.js'
import { Players } from './players.js'
import { GameEvents } from './game-events.js'

// enums would be nice 😠
const RANKS = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Ja', 'Q', 'K', 'A', 'Jo'
]

const SUITS = ['C', 'D', 'H', 'S']

export default class GameState {
  constructor(game, options = {}) {
    this.game = game
    this.deck = this.initializeDeck()
    this.starts = this.initializeStarts()
    this.track = []

    this.rehydrate()
  }

  rehydrate() {
    const gameEvents = this.fetchGameEvents()
    gameEvents.forEach((event) => this.applyEvent(event))
  }

  get players() { return Players.find({gameId: this.gameId}).fetch() }
  get numPlayers() { return this.game.numPlayers }
  get gameId() { return this.game._id }

  start(requestedHandNums = []) {
    const deckClone = _.clone(this.deck)
    const hands = _.range(this.numPlayers).map((i) => {
      return _.range(5).map((j) => {
        let indexOverride = null

        if (requestedHandNums[i] && requestedHandNums[i][j]) {
          indexOverride = _.findIndex(deckClone, (deckCard) => {
            return deckCard.rank == requestedHandNums[i][j]
          })
        }

        return this.drawCard(deckClone, indexOverride)
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

  playCard(player, card, options) {
    // TODO: move outside
    if (player !== this.currentPlayerNum) { return false }

    let gameEventData = {
      gameId: this.gameId,
      num: this.lastEventNum + 1,
      name: 'play',
      player,
      card,
      ...options
    }

    const eventId = GameEvents.insert(gameEventData)

    return
  }

  initializeDeck() {
    const cards = []
    const decks = _.range(this.numPlayers / 2)

    decks.forEach((deck) => {
      SUITS.forEach((suit) => {
        RANKS.slice(0, 13).forEach((rank) => {
          cards.push({rank, suit, deck})
        })
      })

      cards.push({rank: RANKS[13], suit: 'H', deck})
      cards.push({rank: RANKS[13], suit: 'S', deck})
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


  get lastEvent() {
    return GameEvents.findOne({gameId: this.gameId}, {sort: {num: -1}, limit: 1})
  }

  get lastEventNum() {
    return this.lastEvent?.num || null
  }

  get currentPlayerNum() {
    if (!this.lastEvent) { return null }

    if (this.lastEvent.player) {
      return (this.lastEvent.player + 1) % this.numPlayers
    } else {
      return 0
    }
  }

  // NOTE: this does not work with Svelte's reactivity
  drawCard(deck, indexOverride) {
    const index = indexOverride || crypto.randomInt(this.deck.length)
    const card = deck.splice(index, 1)[0]

    return card
  }

  fetchGameEvents() {
    const gameEvents = GameEvents.find({gameId: this.gameId}, {sort: {num: 1}}).fetch()

    if (gameEvents.length == 0) { return [] }

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
      case 'playCard':
        this.applyPlayCardEvent(event)
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

  applyPlayCardEvent(event) {
  }
}
