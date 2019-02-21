import React, { Component } from "react";

import { Home, PostRecipe, Login, Description } from "./components";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/post" component={PostRecipe} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/description" component={Description} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
