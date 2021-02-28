import React from 'react'
import './index.css'
import Login from "./Pages/login";
import Register from "./Pages/register";
import Dashboard from "./Pages/dashboard";
import MenuBar from "./Components/MenuBar";
import SearchFilter from "./Pages/SearchFilter";
import {AuthProvider} from "./Utils/auth";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {Container} from "semantic-ui-react";
import AuthRoute from "./Utils/authroute";
import ProtectRoute from "./Utils/protectroute";

function App() {
    return (
        <Container>
            <AuthProvider>
                <Router>
                    <MenuBar/>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <ProtectRoute exact path="/register" component={Register}/>
                        <AuthRoute exact path="/dashboard" component={Dashboard}/>
                        <AuthRoute exact path="/search" component={SearchFilter}/>
                    </Switch>
                </Router>
            </AuthProvider>
        </Container>
    )
}

export default App