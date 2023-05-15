<script>
    import {title} from '../lib/titleStore.js';
    import PhotoFrame from "../lib/PhotoFrame.svelte";

    title.set('2x6 L A')

    let canvasWidth = 1200;
    let canvasHeight = 1800;
    let screenWidth = 300;
    let screenHeight = 450;
    let blockPoints = [
        {x1: 80, y1:140, x2:80+480, y2: 140+640},
        {x1: 80, y1: 860, x2: 80+480, y2: 860+640},
        {x1: 640, y1: 300, x2: 640+480, y2: 300+640},
        {x1: 640, y1: 1020, x2: 640+480, y2: 1020+640},
    ]
    let frameColors = [
        '#e0e0e0',
    ];

</script>


<PhotoFrame {canvasWidth} {canvasHeight} {screenWidth}
            {screenHeight} {blockPoints} {frameColors}/>