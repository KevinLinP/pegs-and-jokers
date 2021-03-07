import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash'
import { ObjectID } from 'mongodb'

import { Games } from './games.js'
import { Players } from './players.js'
import { GameEvents } from './game-events.js'

import initializeMixin from './game-state/initialize.js'
import playCardMixin from './game-state/play-card.js'

export default class GameState {
  constructor(game, options = {}) {
    this.game = game
    this.initializeDeck()
    this.initializePegs()
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
  get lastEventNum() { return this.lastEvent?.num || null }

  get lastEvent() {
    return GameEvents.findOne({gameId: this.gameId}, {sort: {num: -1}, limit: 1})
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

}

Object.assign(GameState.prototype, initializeMixin)
Object.assign(GameState.prototype, playCardMixin)
