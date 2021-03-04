<script>
  import _ from 'lodash'
  import { select } from 'd3-selection'
  import { transform } from 'd3-transform'
  import { onMount } from 'svelte'

  let svg
  let numPlayers = 6
  let data = _.range(numPlayers).map((n) => {
    return {num: n + 1, mainHoles: _.range(18)}
  })

  function sinD(angle) {
    return Math.sin(angle*Math.PI/180);
  }
  function cosD(angle) {
    return Math.cos(angle*Math.PI/180);
  }

  const holeRadius = 0.5
  const holeSpacing = 2.5
  const sideLength = 18 * holeSpacing
  const boardCircleRadius = sideLength / (2*sinD(180 / numPlayers))
  const angle = (360 / numPlayers)

  onMount(() => {
    var groupTransform = transform()
      .translate((d) => {
        const circleAngle = (-1 * (d.num - 1 ) * angle) + (angle / 2)
        const translate = [
          sinD(circleAngle) * boardCircleRadius,
          cosD(circleAngle) * boardCircleRadius,
        ]
        return translate
      }).rotate((d) => {
        return ((d.num - 1) * angle)
      })

    const group = select(svg).selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', groupTransform)
    
    group.selectAll('circle')
      .data((d, i) => d.mainHoles)
      .join('circle')
      .attr('r', holeRadius)
      .attr('cx', (d) => d * -1 * holeSpacing)
      .attr('cy', 0)
      .attr('fill', (d) => {
        if (d == 0) {
          return "#666666"
        } else {
          return "#FFFFFF"
        }
      })
	});
</script>

<style>
  svg {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>

<div class="container">
  <svg viewBox='-50 -50 100 100' bind:this={svg}>
  </svg>
</div>
