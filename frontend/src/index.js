import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Login from "./Pages/login";
import Register from "./Pages/register";

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
        		</Switch>

        	</Router>
        </div>

    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))