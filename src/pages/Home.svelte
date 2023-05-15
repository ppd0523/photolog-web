<script>
    import {title} from '../lib/titleStore.js';
    import FrameCard from "../lib/FrameCard.svelte";
    import {Link} from "svelte-navigator";

    title.set('포토 로그');

</script>

<div class="home-container w-full">
  <Link to="/frame26la">
    <FrameCard src="/static/thumbnail/frame26la.svg" desc="2매 3,000원"/>
  </Link>
  <Link to="/frame46pa">
    <FrameCard src="/static/thumbnail/frame46pa.svg" desc="2매 4,000원"/>
  </Link>
  <Link to="/frame64la">
    <FrameCard src="/static/thumbnail/frame64la.svg" desc="2매 4,000원"/>
  </Link>
</div>