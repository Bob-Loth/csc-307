import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Login from "./Pages/login";

class App extends Component {
  render() {
    return (
        <div className="container">
          <Login />
        </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))