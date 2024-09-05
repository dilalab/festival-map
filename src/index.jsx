/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import Primary from "./pages/Primary";
import Secondary from "./pages/Secondary";
import OnlyMap from "./pages/OnlyMap";
import { PerformanceProvider } from "./context/performances";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const App = (props) => (
  <PerformanceProvider>{props.children}</PerformanceProvider>
);

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Primary} />
      <Route path="/v2" component={Secondary} />
      <Route path="/v3" component={OnlyMap} />
    </Router>
  ),
  root,
);
