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
    this.initializeCards()
    this.initializePegs()

    this.rehydrate()
  }

  get players() { return Players.find({gameId: this.gameId}).fetch() }
  get numPlayers() { return this.game.numPlayers }
  get gameId() { return this.game._id }
  get lastEventNum() { return this.lastEvent?.num || null }
  get deck() { this.deprecated() }

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
  drawCard(cards, cardOverride) {
    if (cardOverride) {
      if (!cards.delete(cardOverride)) { this.notExpected() }

      return cardOverride
    } else {
      const index = crypto.randomInt(cards.size)
      const card = Array.from(cards.values())[index]
      cards.delete(card)

      return card
    }
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

  moveCard(card, source, destination) {
    if (!source.delete(card)) { this.notExpected() }
    destination.add(card)
  }

  notExpected() {
    throw new Error('not expected')
  }

  notImplemented() {
    throw new Error('to be implemented')
  }

  deprecated() {
    throw new Error('deprecated')
  }
}

Object.assign(GameState.prototype, initializeMixin)
Object.assign(GameState.prototype, playCardMixin)
