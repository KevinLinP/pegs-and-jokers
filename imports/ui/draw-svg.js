import _ from 'lodash'
import * as d3 from 'd3'
import { transform } from 'd3-transform'

const holeRadius = 0.5
const holeSpacing = 2.25
const legLength = 18
const sideLength = legLength * holeSpacing

export default function drawSVG(svg, {numPlayers, playerColors}) {
  const boardCircleRadius = sideLength / (2*sinD(180 / numPlayers))
  const angle = (360 / numPlayers)
  const corners = _.range(numPlayers).map((n) => {
    const circleAngle = (-1 * n * angle) + (angle / 2)
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

  const allElements = corners.concat(legs.flat())

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