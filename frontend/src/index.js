/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Login from "./Pages/login";
import Register from "./Pages/register";
import Dashboard from "./Pages/dashboard";

import { 
	BrowserRouter as Router, 
	Route, 
	Switch, 
	Link, 
	Redirect
} from "react-router-dom";

class App extends Component {
  render() {
    return (
        <div className="container">
          <Router>
            <Switch>
              <Route exact path="/" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/dashboard" component={Dashboard}/>
            </Switch>
          </Router>
        </div>

    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))