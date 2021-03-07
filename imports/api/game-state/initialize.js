import _ from 'lodash'

import { GameEvents } from '../game-events.js'

// enums would be nice 😠
const RANKS = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Ja', 'Q', 'K', 'A', 'Jo'
]

const SUITS = ['C', 'D', 'H', 'S']

export default {
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

    this.deck = cards
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
  },

  applyStartEvent(event) {
    this.hands = event.hands

    const handCards = _.flatten(event.hands)
    handCards.forEach((card) => {
      const index = this.deck.indexOf(card)
      this.deck.splice(index, 1)
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
