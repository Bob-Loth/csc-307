import React, {Component} from 'react'
import './index.css'
import Login from "./Pages/login";
import Register from "./Pages/register";
import Dashboard from "./Pages/dashboard";
import MenuBar from "./Components/MenuBar";
import SearchFilter from "./Pages/SearchFilter";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    //Link,
    //Redirect
} from "react-router-dom";

import {Container} from "semantic-ui-react";

class App extends Component {
    render() {
        return (
            <Container>
                <Router>
                    <MenuBar/>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/dashboard" component={Dashboard}/>
                        <Route exact path="/search" component={SearchFilter}/>
                    </Switch>
                </Router>
            </Container>
        )
    }
}

export default App