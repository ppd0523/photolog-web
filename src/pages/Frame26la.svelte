<script>
  import {title} from '../lib/titleStore.js';
  import PhotoFrame from "../lib/PhotoFrame.svelte";

  let canvasWidth = 600;
  let canvasHeight = 1800;
  let screenWidth = 150;
  let screenHeight = 450;
  let blockPoints = [
      {x1: 20, y1: 20, x2: 20+560, y2: 20+373},  // 393
      {x1: 20, y1: 413, x2: 20+560, y2: 413+373},  // 766
      {x1: 20, y1: 806, x2: 20+560, y2: 806+373},
      {x1: 20, y1: 1199, x2: 20+560, y2: 1199+373},
  ];
  let textPoint = {x: 300, y: 1730};
  let datePoint = {x: 580, y: 1620};
  let initCopy = 2;
  let printFee = 1500;
  let frameSize = '2x6';
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