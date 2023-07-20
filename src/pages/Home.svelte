<script>
    import {title} from '../lib/titleStore.js';
    import {location} from '../lib/locationStore.js';
    import FrameCard from "../lib/FrameCard.svelte";
    import {Link} from "svelte-navigator";

    let params = new URLSearchParams(window.location.search);
    let loc = params.get('loc') || '';
    $location = loc;
    title.set(`포토 로그 ${$location}`);

</script>

<div class="home-container w-full">
  <Link to="/frame26la">
    <FrameCard src="/static/thumbnail/frame26la.svg" desc="2매 3,000원"/>
  </Link>
  <Link to="/frame46pa">
    <FrameCard src="/static/thumbnail/frame46pa.svg" desc="2매 4,000원"/>
  </Link>
<!--  <Link to="/frame64la">-->
<!--    <FrameCard src="/static/thumbnail/frame64la.svg" desc="2매 4,000원"/>-->
<!--  </Link>-->
</div>