<script>
    import {title} from '../lib/titleStore.js';
    import PhotoFrame from "../lib/PhotoFrame.svelte";

    title.set('2x6 L A')

    let canvasWidth = 1800;
    let canvasHeight = 1200;
    let screenWidth = 450;
    let screenHeight = 300;
    let blockPoints = [
        {x1: 140, y1: 80, x2: 140+640, y2: 80+480},
        {x1: 860, y1: 80, x2: 860+640, y2: 80+480},
        {x1: 300, y1: 640, x2: 300+640, y2: 640+480},
        {x1: 1020, y1: 640, x2: 1020+640, y2: 640+480},
    ];
    let frameColors = [
        '#e0e0e0',
    ];

</script>


<PhotoFrame {canvasWidth} {canvasHeight} {screenWidth}
            {screenHeight} {blockPoints} {frameColors}/>