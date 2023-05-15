<script>
  import {title} from '../lib/titleStore.js';
  import PhotoFrame from "../lib/PhotoFrame.svelte";

  title.set('2x6 L A')

  let canvasWidth = 600;
  let canvasHeight = 1800;
  let screenWidth = 150;
  let screenHeight = 450;
  let blockPoints = [
      {x1: 60, y1: 60, x2: 60+480, y2: 60+320},
      {x1: 60, y1: 440, x2: 60+480, y2: 440+320},
      {x1: 60, y1: 820, x2: 60+480, y2: 820+320},
      {x1: 60, y1: 1200, x2: 60+480, y2: 1200+320},
  ];
  let frameColors = [
      '#e0e0e0',
  ];

</script>


<PhotoFrame {canvasWidth} {canvasHeight} {screenWidth}
            {screenHeight} {blockPoints} {frameColors}/>