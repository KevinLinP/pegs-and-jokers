import _ from 'lodash'
import crypto from 'crypto';

import { GameEvents } from '../game-events.js'

export default {
  playCard(player, card, options) {
    // TODO: move outside
    if (player !== this.currentPlayerNum) { return false }
    // TODO: check validity
    
    // TODO: dedup
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

    this.applyEvent(event)
  },

  applyPlayCardEvent(event) {
    const rank = event.card.split(' ')[0]
    switch (rank) {
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '9':
      case '10':
        notImplemented()
        break
      case '7':
        notImplemented()
        break
      case '8':
        notImplemented()
        break
      case 'Ja':
      case 'Q':
      case 'K':
        this.applyFaceCard(event)
        break
      case 'A':
        notImplemented()
        break
      case 'Jo':
        notImplemented()
        break
      default:
        notExpected()
    }
  },

  applyFaceCard(event) {
    const playerNum = event.player
    const pegLoc = this.pegs[playerNum][event.peg]

    if (pegLoc[0] === 'start') {
      const peg = this.starts[playerNum][pegLoc[1]]
      this.starts[playerNum][pegLoc[1]] = null

      const startExit = 8 + (playerNum * 18)
      this.track[startExit] = peg
      this.pegs[playerNum][event.peg] = ['track', startExit]
    } else {
      throw new Error('implement')
    }

    const playerHand = this.hands[playerNum]
    this.moveCard(event.card, playerHand, this.discard)
    this.moveCard(event.drawCard, this.draw, playerHand)
  },

}
