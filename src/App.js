import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { List } from "./List";
import { Smash } from "./Smash";
import { Home } from "./Home";

export function App() {
  return (
    <Router>
      <Switch>
        <Route path="/smash">
          <Smash />
        </Route>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
