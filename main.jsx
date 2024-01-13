import React from "./core/react";
import ReactDOM from "./core/react-dom";

const App = (
  <div k="v">
    app
    <span>haha</span>
  </div>
);

ReactDOM.createRoot(document.querySelector("#app")).render(App);
