import React from "react";
import ReactDOM from "react-dom";
import Map from "./components/Map/index";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Map initialZoom={13} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
