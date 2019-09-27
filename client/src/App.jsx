import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import store from './stores/store';
import Home from './components/layouts/Home';
import Grid from './components/layouts/Grid';
import TestGrid from './components/layouts/TestGrid';
import Layout from "./components/layouts/Layout";
import Authentication from "./components/containers/Authentication";
import About from './components/layouts/About';
import StudentView from "./components/containers/StudentView";
import NewsItemDetail from './components/presentation/NewsItemDetail';
import NewsArticle from "./components/containers/NewsArticle";
import NewsSubmit from "./components/containers/NewsSubmit";
import history from "./history";
import Footer from "./components/Footer/Footer";
import All from "./components/containers/All"

import "assets/scss/material-kit-react.scss?v=1.7.0";

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <Router history = {history}>
                <Switch>
                    <Route exact path={["/","/testing"]} component={Grid}  />
                    <Layout>
                        <Route exact path="/about" component={About} />
                        <Route exact path='/news/:id' component={NewsArticle}/>
                        <Route exact path='/submit' component={NewsSubmit}/>
                        <Route exact path='/login' component={Authentication}/>
                        <Route exact path='/all' component={All} />
                        <Route exact path='/user/:id' component={StudentView}/>
                    </Layout>
                </Switch>
                <Route component={Footer}/>
            </Router>
        </Provider>
       );
  }
}

export default App;