import _ from 'lodash'
import crypto from 'crypto';

import { GameEvents } from '../game-events.js'

export default {
  playCard(player, card, options) {
    // TODO: move outside
    if (player !== this.currentPlayerNum) { return false }
    // TODO: check validity
    
    // TODO: dedup
    if (this.draw.length === 0) {
      notImplemented()
    }
    const drawCard = this.draw[crypto.randomInt(this.draw.length)]

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
    switch (event.card.rank) {
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

    const cardIndex = _.findIndex(playerHand, (c) => {
      return _.isEqual(c, event.card)
    })
    if (cardIndex === -1) { this.notExpected() }
    const card = playerHand.splice(cardIndex, 1)[0]
    this.discard.push(card)

    const drawCardIndex = this.draw.indexOf(event.drawCard)
    const drawCard = this.draw.splice(drawCardIndex, 1)[0]
    this.hands[playerNum].push(drawCard)
  }
}
