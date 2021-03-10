import _ from 'lodash'
import crypto from 'crypto';

import { GameEvents } from '../game-events.js'

export default {
  playCard(player, card, options) {
    // TODO: move outside
    if (player !== this.currentPlayerNum) { return false }
    const availableMove = _.find(this.availableMoves(player), (am) => {
      return _.isEqual(am.move, Object.assign({card}, options))

    })
    if (!availableMove) { return false }
    
    if (this.draw.size === 0) {
      notImplemented()
    }
    const drawCard = Array.from(this.draw)[crypto.randomInt(this.draw.size)]

    let gameEventData = {
      gameId: this.gameId,
      num: this.lastEventNum + 1,
      name: 'playCard',
      player,
      card,
      drawCard,
      ...options
    }

    const eventId = GameEvents.insert(gameEventData)
    const event = GameEvents.findOne(eventId)
    this.applyPlayCardEvent(event, availableMove.result)
  },

  // TODO: cleanup
  applyPlayCardEvent(event, result) {
    this.moveCards(event)
    this.movePegs(event, result)
  },

  // TODO: better name
  moveCards(event) {
    const playerHand = this.hands[event.player]
    this.moveCard(event.card, playerHand, this.discard)
    this.moveCard(event.drawCard, this.draw, playerHand)
  },

  movePegs(event, results) {
    const playerNum = event.player
    results.forEach((result) => {
      console.log(result)
      const pegLoc = this.pegs[playerNum][result.peg]
      const newLoc = result.newLocation
      this.movePeg(pegLoc, newLoc)
    })

  },

  movePeg(pegLoc, newLoc) {
    let peg = null
    if (pegLoc[0] == 'start') {
      const playerStart = this.starts[pegLoc[1]]
      peg = playerStart[pegLoc[2]]
      playerStart[pegLoc[2]] = null
    } else {
      this.notImplemented
    }

    if (!peg) { this.notExpected() }

    if (newLoc[0] == 'track') {
      if (this.track[newLoc[1]]) { this.notExpected() }
      this.track[newLoc[1]] = peg
    }
  }
}
