<script>
  import {title} from '../lib/titleStore.js';
  import PhotoFrame from "../lib/PhotoFrame.svelte";

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
  let textPoint = {x: 300, y: 1710};
  let datePoint = {x: 560,y: 1600};
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