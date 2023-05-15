<script>
    export let title = 'footer';
</script>

<header class="w-full p-4 font-noto bg-teal-400 flex justify-between items-center">
  <h1 class="text-4xl text-white font-bold drop-shadow-lg">{title}</h1>
  <div class="flex gap-4">
    <slot>
      <p>Button1</p>
      <p>Button2</p>
    </slot>
  </div>
</header>