<script>
    import {onMount} from "svelte";
    import * as d3 from "d3";
    import 'cropperjs/dist/cropper.css';
    import Cropper from "cropperjs";

    Cropper.setDefaults({
        viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: false,
        cropBoxResizable: false,
        autoCropArea: 1.0,
        center: true,
        toggleDragModeOnDblclick: false,
    });

    export let canvasWidth;
    export let canvasHeight;
    export let screenWidth;
    export let screenHeight;
    export let blockPoints;

    export let frameColors;

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
    let previewEleme = null;
    let previewSrc = '';
    let cropper = null;

    function closeCropModal() {
        cropHidden = !cropHidden;
    }

    let blockInfos = blockPoints.map(block=>({
        points: block, src: null,
        width: block.x2 - block.x1,
        height: block.y2- block.y1,
    }));

    function changeFrameColor(frameColor) {
        ctx.save();
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

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

    function drawImage(dataURL, _blockInfo) {
        console.log('drawImage func', _blockInfo)
        ctx.clearRect(_blockInfo.points.x1, _blockInfo.points.y1, _blockInfo.width, _blockInfo.height);

        const img = new Image();
        img.src = dataURL;
        img.onload = function() {
            ctx.drawImage(this,
                _blockInfo.points.x1, _blockInfo.points.y1, _blockInfo.width, _blockInfo.height,
            );
        };
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
        console.log('cursor', cursor);
    }

    function onSave() {
        console.log('cropper', cropper)
        const dataURL = cropper.getCroppedCanvas().toDataURL('image/png');
        drawImage(dataURL, blockInfo);

        cropHidden = true;
    }

    function onFileInput(inputFileEvent) {
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
        });

        ctx = canvasElem.getContext('2d');
        const iconImg = new Image();
        iconImg.src = "/static/icon/add_photo_alternate.svg";
        iconImg.onload = function() {
            blockInfos.forEach(_blockInfo=>{
                ctx.strokeStyle = 'rgba(0, 0, 0, .25)'
                ctx.strokeRect(_blockInfo.points.x1+1, _blockInfo.points.y1+1, _blockInfo.width-2, _blockInfo.height-2);

                console.log('drawImage', _blockInfo.points)
                ctx.drawImage(this,
                    _blockInfo.points.x1 + _blockInfo.width/2 - 100,
                    _blockInfo.points.y1 + _blockInfo.height/2 - 100,
                    200, 200
                );
            }); // forEach
        }  // onload

    })

</script>

<!-- Crop modal -->
<div class="absolute w-full h-full flex justify-center items-center" class:hidden={cropHidden}>
  <div class="crop-modal-overlay absolute w-full h-full bg-black opacity-60" on:click={closeCropModal}></div>
  <div class="crop-modal-content w-5/6 h-5/6 top-0 relative border-solid rounded-b-lg bg-white text-center">
    <img bind:this={cropImageElem} src="" alt="crop workspace">
    <div class="flex justify-evenly">
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.reset()}}>
        <img class="h-[50px]" src="/static/icon/reset_image_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.rotate(1)}}>
        <img class="h-[50px]" src="/static/icon/rotate_right_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{cropper.rotate(-1)}}>
        <img class="h-[50px]" src="/static/icon/rotate_left_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={onSave}>
        <img src="/static/icon/done_700.svg" alt="">
      </button>
    </div>
  </div>
</div>

<div class="frame-container flex justify-center">
<!-- Canvas -->
  <input type="file" class="hidden absolute" id="fileInput" accept="image/*"
         bind:this={fileInputElem} on:input={onFileInput} on:click={(e)=>e.target.value=''}>

  <canvas bind:this={canvasElem} id="frame" width={canvasWidth} height={canvasHeight}
          style="width: {screenWidth}px; height: {screenHeight}px;">
    지원하지 않는 브라우저입니다. Chrome, Safari, Samsung 브라우저를 사용해주세요
  </canvas>
</div>

<!-- Preview Modal -->


<style>
  #frame {
      border: 1px solid #e0e0e0;
  }
</style>