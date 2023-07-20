<script>
  import {title} from './titleStore.js';

</script>

<header class="w-full p-2 font-noto bg-teal-400 flex justify-between items-center">
  <h1 class="text-3xl text-white font-bold drop-shadow-lg">{$title}</h1>
  <div class="flex gap-4">
    <slot></slot>
  </div>
</header>
