<script>
    import {onMount} from "svelte";
    import {location} from "./locationStore.js";
    import * as d3 from "d3";
    import moment from "moment";
    import Croppie from "croppie";
    import "croppie/croppie.css";

    $location = '연구실'

    export let canvasWidth;
    export let canvasHeight;
    export let screenWidth;
    export let screenHeight;
    export let blockPoints;
    export let frameColors;
    export let datePoint;
    export let textPoint;
    export let initCopy = 1;
    export let printFee;
    export let frameSize;
    let blockInfo = null;
    let xScale = canvasWidth / screenWidth;
    let yScale = canvasHeight / screenHeight;
    let cursor = null;

    let cropHidden = true;
    let previewHidden = true;
    let ctx = null;
    let canvasElem = null;
    let fileInputElem = null;
    let cropElem = null;
    let previewElem = null;
    let croppie = null;
    let frameColor = frameColors[0].frame;
    let textColor = frameColors[0].text;
    let frameText = '';
    let isDate = true;
    let isOccuppied = [false, false, false, false]
    let printable = true;
    let printCopy = initCopy;

    // $: {
    //     printable = isOccuppied.every((e)=>(e==true));
    // }
    $: {
        if(ctx != null) drawDate(isDate, datePoint);
    }

    function closeCropModal() {
        cropHidden = !cropHidden;
    }
    function closePreviewModal() {
        previewHidden = !previewHidden;
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
        console.log(_blockInfo)
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
        ctx.fillRect(datePoint.x-200, datePoint.y-30, 220, 55)
        ctx.fillStyle = textColor;
        ctx.font = "35px cursive"
        ctx.textAlign = "right";

        if(isDate)
            ctx.fillText(moment().format('YYYY.MM.DD'), datePoint.x, datePoint.y);

        ctx.restore();
    }

    function drawText(text, textPoint={x: 0, y: 0}) {
        frameText = text;
        ctx.save();
        ctx.fillStyle = frameColor;
        ctx.fillRect(20, textPoint.y-70, 570, 110)
        ctx.fillStyle = textColor;
        ctx.font = "60px 'cursive'"
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
        croppie.result({
            type: 'canvas',
            quality: 1,
        }).then(url=>{
            drawImage(url, blockInfo);
        })

        isOccuppied[cursor] = true;
        cropHidden = true;
    }

    function onPrint() {
        previewHidden = false;

        previewElem.src = canvasElem.toDataURL('image/png');
    }

    function onTextInput(inputTextEvent) {
        frameText = inputTextEvent.target.value;

        drawText(inputTextEvent.target.value.slice(0,10), textPoint);
    }

    function onFileInput(inputFileEvent) {
        inputFileEvent.preventDefault();

        const url = URL.createObjectURL(inputFileEvent.target.files[0]);
        croppie.bind({
            url
        })

        cropHidden = false;

    } // function onFileInput

    function onUpCopy() {
        printCopy += initCopy;
    }
    function onDownCopy() {
        if (printCopy > initCopy)
          printCopy -= initCopy;
    }
    function onSubmit() {
        const formData = new FormData();

        canvasElem.toBlob((blob)=>{
            formData.append('framed', blob, `frame.png`)
            formData.append('size', frameSize)
            formData.append('location', $location)
            formData.append('copy', printCopy)
            fetch("https://www.pphotolog.com/printer/photos/", {
                method: "PUT",
                body: formData,
            })
            .then(res=>{
                switch (res.status) {
                    case 201:

                        break;
                    default:
                        console.error('error', res.status)
                        console.error(res.statusText)
                }

            })
            .catch(error=>{
                console.error(error.message)
            })

        })

        // window.location.replace(`/?location=${$location}`)
    }

    onMount(()=>{
        d3.select("#frame")
        .on('click', (e)=> {
          const [[screenX, screenY], ...rest] = d3.pointers(e);
          setCursor(screenX, screenY);

          if (blockInfo == null) return;

          fileInputElem.click();
        })

        let aspectRatio = blockInfos[0].height / blockInfos[0].width;
        let viewport_width = Math.min(280, blockInfos[0].width);
        let viewport_height = viewport_width * aspectRatio;

        croppie = new Croppie(cropElem, {
          viewport: {
            width: viewport_width,
            height: viewport_height,
          },
          container: {
            width: "100%",
            height: "100%",
          },
          boundary: {
            width: "100%",
            height: "100%",
          },
          showZoomer: false,
          enableOrientation: true,
        })

        ctx = canvasElem.getContext('2d');

        // Draw background
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw icon, box
        const iconImg = new Image();
        iconImg.src = "/assets/icon/add_photo_alternate.svg";
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
  <div class="crop-modal-content w-[80%] h-[70%] top-0 relative border-solid rounded-b-lg bg-white text-center">
    <div id="crop" bind:this={cropElem} />
    <div class="flex justify-evenly">
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={()=>{
        croppie.rotate(90);
      }}>
        <img src="/assets/icon/rotate_left_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
      on:click={onSave}>
        <img src="/assets/icon/done_700.svg" alt="done icon">
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
             on:input={onTextInput}
             placeholder="상태 메세지">
    <div class="flex items-center pl-2 border border-gray-300 rounded-r-lg dark:border-gray-700">
      <input id="date-checkbox" type="checkbox" bind:checked={isDate} name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
      <label for="date-checkbox" class="w-full p-2 text-md font-noto text-gray-900 dark:text-gray-300">날짜</label>
    </div>
  </div>
  <div class="frame-panel flex">
  {#each frameColors as _frameColor}
    <svg width="24" height="24" class="m-0.5">
      <circle cx="12" cy="12" r="11"
        stroke-width="2" stroke="rgba(0,0,0,0.25)" on:click={(e)=>{
            setFrameAndTextColor(_frameColor);
        }} fill="{_frameColor.frame}"
      ></circle>
    </svg>
  {/each}
  </div>
  <div class="frame-result absolute top-0 right-0">
    {#if printable}
    <button class="p-1 m-1 rounded-lg shadow"
          on:click={onPrint}>
      <img src="/assets/icon/print_on.svg" class="h-10" alt="printer on icon">
    </button>
    {:else}
    <button disabled class="p-1 m-1 rounded-lg shadow">
      <img src="/assets/icon/print_off.svg" class="h-10" alt="printer on icon">
    </button>
    {/if}

  </div>
</div>

<!-- Preview Modal -->
<div class="absolute w-full h-full flex justify-center items-center" class:hidden={previewHidden}>
  <div class="preview-modal-overlay absolute w-full h-full bg-black opacity-60" on:click={closePreviewModal}></div>
  <div class="preview-modal-content w-[80%] h-[80%] top-0 relative flex flex-col justify-evenly border-solid rounded-lg bg-white text-center">
    <div class="preview-container flex flex-col justify-center items-center">
      <img bind:this={previewElem} class="max-h-[300px] w-fit m-1" id="preview" src="#" alt="preview image">
      <div class="preview-panel flex flex-col justify-evenly items-center gap-4">
        <div class="copy-btn-panel mr-1 text-4xl flex items-center">
          <div class="copy-btn ml-1 flex">
            <button on:click={onUpCopy}><img src="/assets/icon/arrow_upward_700.svg" class="h-15" alt="arrow up image"></button>
            {printCopy} 장
            <button on:click={onDownCopy}><img src="/assets/icon/arrow_downward_700.svg" class="h-15" alt="arrow down image"></button>
          </div>
        </div>
        <div class="fee-panel flex text-4xl items-baseline">
          <img src="/assets/icon/won.svg" class="h-5 mr-1" alt="">
          {d3.format(',')(printCopy * printFee)}
        </div>
        <div class="payment-panel text-2xl">
          <button class="p-1 border-2 rounded-lg border-blue-400 text-blue-400" on:click={onSubmit}>
            <span class="p-1 m-1">카카오페이</span>
          </button>
          <button class="p-1 border-2 rounded-lg border-blue-400 text-blue-400" on:click={onSubmit}>
            <span class="p-1 m-1">네이버페이</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</div>

<style>
  #frame {
      border: 1px solid #e0e0e0;
  }
</style>
