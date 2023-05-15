<script>
  import {Router, Route, Link} from "svelte-navigator"
  import Home from "./pages/Home.svelte";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  import Frame26la from "./pages/Frame26la.svelte";
  import Frame46pa from "./pages/Frame46pa.svelte";
  import Frame64la from "./pages/Frame64la.svelte";
  

</script>

  <Router>
    <Header title="포토 로그">
      <button>1</button>
      <button>2</button>
    </Header>

    <Route path="/" component={Home} />

    <Route path="/frame26la" component={Frame26la}/>
    <Route path="/frame46pa" component={Frame46pa}/>
    <Route path="/frame64la" component={Frame64la}/>

    <Footer></Footer>
  </Router>
