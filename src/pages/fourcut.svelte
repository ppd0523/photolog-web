<script>
  import moment from "moment";
  import html2canvas from "html2canvas";
  import Cropper from "cropperjs";
  import "cropperjs/dist/cropper.min.css";
  import {onMount} from "svelte";

  Cropper.setDefaults({
      dragMode: 'move',
      viewMode: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
  })

  export let color;  // {frame, text}

  let width = 150;
  let margin = 9;
  let fileElem;
  let selectedElem;
  let frameElem;
  let cropElem;
  let cropper = null;
  let text = '';
  let isDate = true;
  let cropHidden = true;

  onMount(()=>{

  })

  function slicedText(text){
      return text.slice(0, 12);
  }

  function onFileInput(inputFileEvent) {
    cropHidden = false;

    let file = inputFileEvent.target.files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
        // selectedElem.firstElementChild.src = e.target.result;
        let url = e.target.result;

    }
    reader.readAsDataURL(file);

  }
  function selected() {
      selectedElem = this;
      fileElem.click();
  }

  function onClose() {
      cropHidden = true;
  }
  function onSave() {
    // selectedElem.firstElementChild.src = cropper.getCroppedCanvas().toDataURL('image/png');

    onClose();
  }
  function preview() {

      html2canvas(frameElem, {scale: 4}).then(canvas=>{
          const a = document.createElement("a")
          a.href = canvas.toDataURL('image/png');
          a.download = 'download.png'
          a.click();
          // document.getElementById("preview").appendChild(canvas);
      })
  }
</script>

<!-- Modal -->
<div class="absolute w-full h-full flex justify-center items-center" class:hidden={cropHidden} class:bg-color={color?.frame}>
  <div class="crop-modal-overlay absolute w-full h-full bg-black opacity-60" on:click={onClose}></div>
  <div class="crop-modal-content w-[80%] h-[50%] top-0 relative border-solid rounded-b-lg bg-white text-center">
    <img id="crop" src="#" alt="" bind:this={cropElem} />
<!--    <div id="crop" bind:this={cropElem} />-->
    <div class="flex justify-evenly">
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
              on:click={()=>{
                cropper.setBounds({width: '100%', height: 'auto'})
      }}>
        <img src="/static/icon/reset_image_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
              on:click={()=>{
                cropper.setBounds({width: '50%', height: 'auto'})
      }}>
        <img src="/static/icon/rotate_right_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
              on:click={()=>{

      }}>
        <img src="/static/icon/rotate_left_700.svg" alt="">
      </button>
      <button class="bg-white p-2 m-2 border border-gray-400 rounded-full shadow"
              on:click={onSave}>
        <img src="/static/icon/done_700.svg" alt="">
      </button>
    </div>
  </div>
</div>

<!-- Photo frame -->
<div bind:this={frameElem} id="photo-frame" class="border border-gray-200 w-[150px] aspect-[1/3] flex flex-col items-center" style="">
  <input bind:this={fileElem} type="file" class="hidden" accept="image/*" on:click={e=>{e.target.value=''}} on:input={onFileInput}>

  {#each [0, 1, 2, 3] as i}
  <div id={`image${i}`} class=" w-[132px] mt-2 aspect-[45/32] flex justify-center items-center" on:click={selected}>
    <img src="/static/icon/add_photo_alternate.svg" alt="" class="w-full aspect-[45/32]">
  </div>
  {/each}

  <div id="bottom" class="text w-[132px]">
    <p id="date" class="text-[6px] mt-1 text-right" class:visible={isDate} class:invisible={!isDate}>{moment().format('YYYY.MM.DD')}</p>
    <p id="message" class="font-noto font-bold text-xs text-center tracking-widest">{slicedText(text)}</p>
  </div>
</div>

<!--Bottom text-->
<div class="input h-10">
  <input type="text" bind:value={text} placeholder="상태 메세지를 입력하세요" class="font-noto font-bold pl-2 h-full border border-gray-200 rounded-l-lg mr-0">
  <button
    class:bg-blue-400={isDate} class:text-white={isDate}
    class="font-noto font-bold w-12 h-full border border-gray-200 rounded-r-lg" on:click={()=>{isDate = !isDate}}>날짜</button>
  <button on:click={preview}>결과</button>
</div>

<!-- Background frame -->
<div id="preview"></div>

<style>
  #photo-frame {
      background-color: #e0e0e0;
  }
  .text {
      color: blue;
  }
</style>