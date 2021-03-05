import _ from 'lodash'
import * as d3 from 'd3'
import { transform } from 'd3-transform'


export default function drawSVG(svg, {numPlayers, playerColors}) {
  let data = _.range(numPlayers).map((n) => {
    return {num: n + 1, mainHoles: _.range(18), color: playerColors[n] || '#FFFFFF'}
  })

  function sinD(angle) {
    return Math.sin(angle*Math.PI/180);
  }
  function cosD(angle) {
    return Math.cos(angle*Math.PI/180);
  }

  const holeRadius = 0.5
  const holeSpacing = 2.25
  const sideLength = 18 * holeSpacing
  const boardCircleRadius = sideLength / (2*sinD(180 / numPlayers))
  const angle = (360 / numPlayers)

  var groupTransform = transform()
    .translate(function (d) {
      const circleAngle = (-1 * (d.num - 1) * angle) + (angle / 2)
      const translate = [
        sinD(circleAngle) * boardCircleRadius,
        cosD(circleAngle) * boardCircleRadius,
      ]
      return translate
    }).rotate(function (d) {
      return ((d.num - 1) * angle)
    })

  const board = d3.select(svg).append('g').attr('id', 'svg-board')

  const group = board.selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', groupTransform)

  group.append('g')
    .selectAll('circle')
    .data(function (d, i) { return d.mainHoles })
    .join('circle')
    .attr('r', holeRadius)
    .attr('cx', (d) => d * -1 * holeSpacing)
    .attr('cy', 0)
    .attr('fill', (d) => {
      if (d == 0) {
        return "#666666"
      } else if (d == 3 || d == 8) {
        return "#FFFFFF"
      } else {
        return "#FFFFFF"
      }
    })

  const startPositions = [
    [0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]
  ]

  const startTransform = transform().translate(-8 * holeSpacing, -2 * holeSpacing)

  group.append('g')
    .attr('transform', startTransform)
    .selectAll('circle')
    .data(_.range(5))
    .join('circle')
    .attr('r', holeRadius)
    .attr('cx', function (d) { return (startPositions[d][0]) * holeSpacing })
    .attr('cy', function (d) { return (startPositions[d][1]) * holeSpacing })
    .attr('fill', function (d) { return this.parentNode.__data__.color })

  const homeTransform = transform().translate(-3 * holeSpacing, 0 * holeSpacing).rotate(-30)

  group.append('g')
    .attr('transform', homeTransform)
    .selectAll('circle')
    .data(_.range(5))
    .join('circle')
    .attr('r', holeRadius)
    .attr('cx', 0)
    .attr('cy', function (d) { return ((d * -1) - 1) * holeSpacing })
    .attr('fill', function (d) { return this.parentNode.__data__.color })
}