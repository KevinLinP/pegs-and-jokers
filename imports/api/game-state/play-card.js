import _ from 'lodash'

import { GameEvents } from '../game-events.js'

export default {
  playCard(player, card, options) {
    // TODO: move outside
    if (player !== this.currentPlayerNum) { return false }
    // TODO: check validity

    let gameEventData = {
      gameId: this.gameId,
      num: this.lastEventNum + 1,
      name: 'playCard',
      player,
      card,
      ...options
    }

    const eventId = GameEvents.insert(gameEventData)
    const event = GameEvents.findOne(eventId)

    this.applyEvent(event)
  },

  applyPlayCardEvent(event) {
    const rank = event.card.rank
    switch (rank) {
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '9':
      case '10':
        throw new Error('implement')
        break
      case '7':
        throw new Error('implement')
        break
      case '8':
        throw new Error('implement')
        break
      case 'Ja':
      case 'Q':
      case 'K':
        this.applyFaceCard(event)
        break
      case 'A':
        throw new Error('implement')
        break
      case 'Jo':
        throw new Error('implement')
        break
    }
  },

  applyFaceCard(event) {
    console.log('hi')
  }
}
