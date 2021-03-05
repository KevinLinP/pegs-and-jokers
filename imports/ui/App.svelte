<script>
  import { onMount } from 'svelte'

  import ToDo from './ToDo.svelte'
  import drawSvg from './draw-svg.js'

  import panzoom from 'panzoom'
  import svgPanZoom from 'svg-pan-zoom'

  let svg

  onMount(() => {
    const numPlayers = 6
    const playerColors = [
      '#FF8C00',
      '#00FFFF',
      '#FF0000',
      '#FFF68F',
      '#00FF00',
      '#ff00ff'
    ]

    drawSvg(svg, {numPlayers, playerColors})

    svgPanZoom('#svg')
	});
</script>

<style>
  svg {
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 90vh;
  }
</style>

<div id="svg-wrapper">
  <svg viewBox='-50 -50 100 100' bind:this={svg} id="svg">
  </svg>
</div>

<div class="container">
  <ToDo />
</div>