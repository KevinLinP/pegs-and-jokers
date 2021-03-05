import _ from 'lodash'
import * as d3 from 'd3'
import { transform } from 'd3-transform'

const holeRadius = 0.5
const holeSpacing = 2.25
const legLength = 18
const sideLength = legLength * holeSpacing

export default function drawSVG(svg, {numPlayers, playerColors}) {
  const boardCircleRadius = sideLength / (2*sinD(180 / numPlayers))
  const angleDelta = (360 / numPlayers)
  const corners = _.range(numPlayers).map((n) => {
    const circleAngle = (-1 * n * angleDelta) + (angleDelta / 2)
    return {
      x: sinD(circleAngle) * boardCircleRadius,
      y: cosD(circleAngle) * boardCircleRadius
    }
  })

  const legs = corners.map((corner, i) => {
    const leg = []
    const nextIndex = (i + 1) % numPlayers

    const dX = (corners[nextIndex].x - corner.x) / legLength
    const dY = (corners[nextIndex].y - corner.y) / legLength

    let currentX = corner.x
    let currentY = corner.y

    _.range(legLength - 1).forEach(() => {
      currentX += dX
      currentY += dY

      leg.push({x: currentX, y: currentY})
    })

    return leg
  })

  const starts = legs.map((leg, legNum) => {
    const reference = leg[7]
    const relativePositions = [
      [0, -3], [-1, -2], [0, -2], [1, -2], [0, -1]
    ]

    return relativePositions.map((pos) => {
      let x = pos[0] * holeSpacing
      let y = pos[1] * holeSpacing

      const rotationAngle = -1 * angleDelta * legNum
      const rotated = rotate(x, y, rotationAngle)

      x = rotated[0] + reference.x
      y = rotated[1] + reference.y

      return {x, y}
    })
  })

  const homes = legs.map((leg, legNum) => {
    const reference = leg[2]

    return _.range(1, 6).map((num) => {
      let x = 0
      let y = -1 * num * holeSpacing
      const rotationAngle = -1 * angleDelta * legNum + 30
      const rotated = rotate(x, y, rotationAngle)

      x = rotated[0] + reference.x
      y = rotated[1] + reference.y

      return {x, y}
    })
  })

  const allElements = corners
    .concat(legs.flat())
    .concat(starts.flat())
    .concat(homes.flat())

  const board = d3.select(svg)
    .selectAll('circle')
    .data(allElements)
    .join('circle')
    .attr('r', holeRadius)
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('fill', function (d) { return '#FFFFFF' })
}

function sinD(angle) {
  return Math.sin(angle*Math.PI/180);
}
function cosD(angle) {
  return Math.cos(angle*Math.PI/180);
}

function rotate(x, y, angle) {
  const sin = sinD(angle)
  const cos = cosD(angle)
  const nx = (cos * x) + (sin * y)
  const ny = (cos * y) - (sin * x)

  return [nx, ny]
}