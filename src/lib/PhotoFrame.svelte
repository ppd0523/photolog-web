<script>
    import {onMount} from "svelte";
    import * as d3 from "d3";
    import moment from "moment";
    import 'cropperjs/dist/cropper.css';
    import Cropper from "cropperjs";

    Cropper.setDefaults({
        viewMode: 1,
        dragMode: 'none',
        cropBoxMovable: true,
        cropBoxResizable: true,
        autoCropArea: 1.0,
        center: true,
        toggleDragModeOnDblclick: false,
        checkCrossOrigin: false,
        background: false,
        zoomable: false,
        zoomOnWheel: false,
        zoomOnTouch: false,
    });

    export let canvasWidth;
    export let canvasHeight;
    export let screenWidth;
    export let screenHeight;
    export let blockPoints;
    export let frameColors;
    export let datePoint;
    export let textPoint;

    let blockInfo = null;
    let xScale = canvasWidth / screenWidth;
    let yScale = canvasHeight / screenHeight;
    let cursor = null;

    let cropHidden = true;
    let previewHidden = true;
    let ctx = null;
    let canvasElem = null;
    let fileInputElem = null;
    let cropImageElem = null;
    let previewElem = null;
    let previewSrc = '';
    let cropper = null;
    let frameColor = frameColors[0].frame;
    let textColor = frameColors[0].text;
    let frameText = '';
    let isDate = true;

    let rotatable = false;

    $: {
        if(ctx != null) drawDate(isDate, datePoint);
    }

    function closeCropModal() {
        cropHidden = !cropHidden;
    }

    let blockInfos = blockPoints.map(block=>({
        points: block, src: null,
        width: block.x2 - block.x1,
        height: block.y2- block.y1,
    }));

    function saveBlocks() {
        blockInfos.forEach((_blockInfo,i)=>{
            blockInfos[i].dataURL = ctx.getImageData(
                _blockInfo.points.x1, _blockInfo.points.y1,
                _blockInfo.width, _blockInfo.height,
            );
        })
    }

    function restoreBlocks() {
        blockInfos.forEach((_blockInfo, i) => {
            ctx.putImageData(_blockInfo.dataURL,
                _blockInfo.points.x1, _blockInfo.points.y1,
            );
            blockInfos[i].dataURL = null;
        })
    }

    function setFrameAndTextColor({frame, text}) {
        frameColor = frame;
        textColor = text;
        saveBlocks();
        ctx.save();
        ctx.fillStyle = frame;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
        restoreBlocks();
        drawText(frameText, textPoint);
        drawDate(isDate, datePoint);
    }

    function drawImage(dataURL, _blockInfo) {
        ctx.clearRect(_blockInfo.points.x1, _blockInfo.points.y1, _blockInfo.width, _blockInfo.height);

        const img = new Image();
        img.src = dataURL;
        img.onload = function() {
            ctx.drawImage(this,
                _blockInfo.points.x1, _blockInfo.points.y1, _blockInfo.width, _blockInfo.height,
            );
        };
    }

    function drawDate(isDate, datePoint={x:0, y:0}) {
        ctx.fillStyle = frameColor;
        ctx.fillRect(datePoint.x-240, datePoint.y-45, 270, 55)
        ctx.fillStyle = textColor;
        ctx.font = "45px Sans MS"
        ctx.textAlign = "right";

        if(isDate)
            ctx.fillText(moment().format('YYYY.MM.DD'), datePoint.x, datePoint.y);

        ctx.restore();
    }

    function drawText(text, textPoint={x: 0, y: 0}) {
        frameText = text;
        ctx.save();
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, textPoint.y-90, 620, 110)
        ctx.fillStyle = textColor;
        ctx.font = "80px Sans MS"
        ctx.textAlign = "center";
        ctx.fillText(text, textPoint.x, textPoint.y);
        ctx.restore();
    }

    function setCursor(screenX, screenY) {
        let selected = false;
        blockInfos.some((_blockInfo, i)=>{
            const {x1, y1, x2, y2} = _blockInfo.points;
            const x = screenX * xScale;
            const y = screenY * yScale;

            if( x1 <= x && x <= x2 && y1 <= y && y <= y2) {
                cursor = i;
                blockInfo = blockInfos[cursor];
                selected = true;
                return true;
            }
        });
        if (!selected) {
            cursor = null;
            blockInfo = null;
        }
    }

    function onSave() {
        const dataURL = cropper.getCroppedCanvas().toDataURL('image/png');
        drawImage(dataURL, blockInfo);

        cropHidden = true;
    }



    function onTextInput(inputTextEvent) {
        frameText = inputTextEvent.target.value;

        drawText(inputTextEvent.target.value.slice(0,9), textPoint);
    }

    function onFileInput(inputFileEvent) {
        inputFileEvent.preventDefault();

        cropImageElem.src = URL.createObjectURL(inputFileEvent.target.files[0]);
        if(cropper != null) cropper.destroy();

        cropper = new Cropper(cropImageElem, {
            aspectRatio: blockInfos[0].width / blockInfos[0].height,
        })

        cropHidden = false;

    } // function onFileInput

    onMount(()=>{
        d3.select("#frame")
        .on('click', (e)=> {
          const [[screenX, screenY], ...rest] = d3.pointers(e);
          setCursor(screenX, screenY);

          if (blockInfo == null) return;

          fileInputElem.click();
        })

        ctx = canvasElem.getContext('2d');

        // Draw background
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw icon, box
        const iconImg = new Image();
        iconImg.src = "/static/icon/add_photo_alternate.svg";
        iconImg.onload = function() {
            blockInfos.forEach(_blockInfo=>{
                ctx.strokeStyle = 'rgba(0, 0, 0, .25)'
                ctx.strokeRect(_blockInfo.points.x1+1, _blockInfo.points.y1+1, _blockInfo.width-2, _blockInfo.height-2);

                ctx.drawImage(this,
                    _blockInfo.points.x1 + _blockInfo.width/2 - 100,
                    _blockInfo.points.y1 + _blockInfo.height/2 - 100,
                    200, 200
                );
            }); // forEach
        }  // onload

        // Draw date
        drawDate(isDate, datePoint);
    })

</script>

<!-- crop modal -->
<div class="absolute w-full h-full flex justify-center items-center" class:hidden={cropHidden}>
  <div class="crop-modal-overlay absolute w-full h-full bg-black opacity-60" on:click={closeCropModal}></div>
  <div class="crop-modal-content w-[80%] max-h-[70%] top-0 relative border-solid rounded-b-lg bg-white text-center">
    <img class="w-full" id="origin-img" bind:this={cropImageElem} src="" alt="crop workspace">
    <div class="flex justify-evenly">
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.reset()}}>
        <img src="/static/icon/reset_image_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.rotate(1)}}>
        <img src="/static/icon/rotate_right_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.rotate(-1)}}>
        <img src="/static/icon/rotate_left_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={onSave}>
        <img src="/static/icon/done_700.svg" alt="">
      </button>
    </div>
  </div>
</div>

<div class="frame-container flex flex-col justify-center items-center gap-4">
<!-- Canvas -->
  <input type="file" class="hidden absolute" id="fileInput" accept="image/*"
         bind:this={fileInputElem} on:input={onFileInput} on:click={(e)=>e.target.value=''}>

  <canvas bind:this={canvasElem} id="frame" width={canvasWidth} height={canvasHeight}
          style="width: {screenWidth}px; height: {screenHeight}px;">
    지원하지 않는 브라우저입니다. Chrome, Safari, Samsung 브라우저를 사용해주세요
  </canvas>
  <div class="message flex m-0">
    <input type="text" id="textInput" class="block w-40 p-2 border border-gray-300 rounded-l-lg"
             on:input={onTextInput} maxlength="9"
             placeholder="상태 메세지">
    <div class="flex items-center pl-2 border border-gray-300 rounded-r-lg dark:border-gray-700">
      <input id="date-checkbox" type="checkbox" bind:checked={isDate} name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
      <label for="date-checkbox" class="w-full p-2 text-md font-noto text-gray-900 dark:text-gray-300">날짜</label>
    </div>
  </div>
  <div class="frame-panel flex">
  {#each frameColors as _frameColor}
    <svg width="32" height="32" class="m-2">
      <circle cx="16" cy="16" r="15"
        stroke-width="2" stroke="rgba(0,0,0,0.25)" on:click={(e)=>{
            setFrameAndTextColor(_frameColor);
        }} fill="{_frameColor.frame}"
      ></circle>
    </svg>
  {/each}
  </div>
</div>

<!-- Preview Modal -->


<style>
  #frame {
      border: 1px solid #e0e0e0;
  }
  :global(.cropper-canvas) {
      transform: none;
  }

</style>