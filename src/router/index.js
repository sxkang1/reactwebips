import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import Login from "../component/login";
import Webgl from "../component/WebGL.js";
import ImageList from "../component/imageList.js";
import Details from "../component/details.js";

export default class IRouter extends React.Component {
  render() {
    return (
      <Router history={createBrowserHistory()}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/imageList" component={ImageList} />
          <Route exact path="/imageList/webgl" component={Webgl} />
          <Route exact path="/imageList/details" component={Details} />
        </Switch>
      </Router>
    );
  }
}
