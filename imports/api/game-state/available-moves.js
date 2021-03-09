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


      cardMoves.forEach((move) => {
        move.action = 'playCard'
        move.card = card
      })

      this.merge(availableMoves, cardMoves)
    })

    return availableMoves
  },

  startExitMoves(playerNum) {
    startExit = this.track[8 + (playerNum * 18)]
    if (startExit) { return [] }

    const moves = []
    this.starts[playerNum].forEach((startPeg) => {
      if (!startPeg) { return }
      const move = {peg: startPeg.peg}
      moves.push(move)
    })

    return moves
  },

  merge(destination, source) {
    source.forEach((item) => {
      destination.push(item)
    })
  }
}

