<script>
  const todos = [
    'animate moving peg',
    'tweak panning/zooming',
    'finish playing cards data model',
    'data model pieces/positions',
    'taking actions',
    'available moves calculator',
    'display playing cards',
    'undo/redo',
    'player setup',
    'lots more'
  ]
</script>

<div style="margin-top: 10rem;">
  <div class="display-6 mb-2">To Do</div>
  <ul>
    {#each todos as todo}
      <li>{ todo }</li>
    {/each}
  </ul>
</div>