<script>
    import {title} from '../lib/titleStore.js';
    import PhotoFrame from "../lib/PhotoFrame.svelte";

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
    let textPoint = {x: 305, y: 1710};
    let datePoint = {x: 1120, y: 1730};
    let initCopy = 2;
    let printFee = 2000;
    let frameSize = '4x6';
    let frameColors = [
        {frame: '#ffffff', text: '#000000'},
        {frame: '#e0e0e0', text: '#000000'},
        {frame: '#d0e4c3', text: '#000000'},
        {frame: '#ef94a5', text: '#ffffff'},
        {frame: '#cbafd3', text: '#ffffff'},

        {frame: '#607ca0', text: '#ffffff'},
        {frame: '#2bc3bc', text: '#ffffff'},
        {frame: '#d75864', text: '#ffffff'},
        {frame: '#a12960', text: '#ffffff'},
        {frame: '#6e574d', text: '#ffffff'},
        {frame: '#000000', text: '#e0e0e0'},
    ];

</script>


<PhotoFrame {canvasWidth} {canvasHeight} {screenWidth}
            {screenHeight} {blockPoints} {frameColors}
            {frameSize} {textPoint} {datePoint}
            {initCopy} {printFee}/>