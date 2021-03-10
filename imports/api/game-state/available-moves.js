export default {
  availableMoves(playerNum) {
    const availableMoves = []
    const playerHand = this.hands[playerNum]

    playerHand.forEach((card) => {
      const rank = card.split(' ')[0]

      const cardMoves = []

      switch (rank) {
        case 'Ja':
        case 'Q':
        case 'K':
          this.merge(
            cardMoves,
            this.startExitMoves(playerNum)
          )
          break
        default:
          // this.notImplemented()
          break
      }


      cardMoves.forEach(({move}) => {
        move.card = card
      })

      this.merge(availableMoves, cardMoves)
    })

    return availableMoves
  },

  startExitMoves(playerNum) {
    startExitIndex = 8 + (playerNum * 18)
    startExitPeg = this.track[startExitIndex]
    if (startExitPeg) {
      if (startExitPeg.player == playerNum) {
        return []
      } else {
        // TODO: figure out this case
        this.notImplemented()
      }
    }

    const moves = []
    this.starts[playerNum].forEach((startPeg) => {
      if (!startPeg) { return }
      const move = {peg: startPeg.peg}
      const result = [
        {peg: startPeg.peg, newLocation: ['track', startExitIndex]}
      ]
      moves.push({move, result})
    })

    return moves
  },

  merge(destination, source) {
    source.forEach((item) => {
      destination.push(item)
    })
  }
}

