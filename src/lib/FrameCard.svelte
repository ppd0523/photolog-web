<script>
    export let src;
    export let desc;
</script>

<div class="card-container m-2 shadow-md flex items-center">
    <img class="p-2" {src} alt="Frame thumbnail">
    <span class="font-noto font-bold ml-10 text-3xl text-bold text-teal-400">{desc}</span>
</div>

<style>
    img {
        width: 100px;
        height: 100px;
    }
</style>