import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import WebGl from "./component/WebGL";
import Routes from "./router";
//加快react运行速度的一个js文件
import registerServiceWorker from "./registerServiceWorker";
{
  /* <BrowserRouter> </BrowserRouter> */
}
ReactDOM.render(<Routes />, document.getElementById("root"));

registerServiceWorker();
