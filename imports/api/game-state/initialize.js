import _ from 'lodash'

import { GameEvents } from '../game-events.js'

// enums would be nice 😠
const RANKS = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Ja', 'Q', 'K', 'A', 'Jo'
]

const SUITS = ['C', 'D', 'H', 'S']

export default {
  initializeCards() {
    const cards = new Set()
    const numDecks = this.numPlayers / 2

    _.range(numDecks).forEach((deck) => {
      SUITS.forEach((suit) => {
        RANKS.slice(0, 13).forEach((rank) => {
          // this is the jankiest part of the code so far
          cards.add(`${rank} ${suit} ${deck}`)
        })
      })

      cards.add(`Jo H ${deck}`)
      cards.add(`Jo S ${deck}`)
    })

    this.draw = cards
    this.discard = new Set()
  },

  initializePegs() {
    this.pegs = []
    this.track = []
    this.starts = []
    this.homes = []

    _.range(this.numPlayers).forEach((player) => {
      this.starts[player] = []
      this.pegs[player] = []
      this.homes[player] = []

      _.range(5).forEach((peg) => {
        const pegObj = {player, peg}

        this.pegs[player][peg] = ['start', peg]
        this.starts[player][peg] = pegObj
      })
    })
  },

  start(requestedHandNums = []) {
    const drawClone = _.clone(this.draw)
    const hands = _.range(this.numPlayers).map((i) => {
      return _.range(5).map((j) => {
        let cardOverride = null

        if (requestedHandNums[i] && requestedHandNums[i][j]) {
          cardOverride = requestedHandNums[i][j]
        }

        return this.drawCard(drawClone, cardOverride)
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
  },

  applyStartEvent(event) {
    this.hands = []

    event.hands.forEach((eventHand, i) => {
      this.hands[i] = new Set()

      eventHand.forEach((card) => {
        this.moveCard(card, this.draw, this.hands[i])
      })
    })
  },

  rehydrate() {
    const gameEvents = this.fetchGameEvents()
    gameEvents.forEach((event) => this.applyEvent(event))
  },

  fetchGameEvents() {
    const gameEvents = GameEvents.find({gameId: this.gameId}, {sort: {num: 1}}).fetch()

    if (gameEvents.length == 0) { return [] }

    if (gameEvents[0].num != 0 || _.last(gameEvents).num != (gameEvents.length - 1)) {
      throw new Error('missing game events')
    }

    return gameEvents
  }
}
