import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import store from './stores/store';
import Home from './components/layouts/Home';
import Grid from './components/layouts/Grid';
import Layout from "./components/layouts/Layout";
import Authentication from "./components/containers/Authentication";
import About from './components/layouts/About';
import StudentView from "./components/containers/StudentView";
import NewsItemDetail from './components/presentation/NewsItemDetail';
import NewsArticle from "./components/containers/NewsArticle";
import NewsSubmit from "./components/containers/NewsSubmit";

import "assets/scss/material-kit-react.scss?v=1.7.0";

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <Route exact path="/" component={Grid} />
                    <Route path="/about" component={About} exact />
                    <Route path='/news/:id' component={NewsArticle}/>                    <Route path='/news/:id' component={NewsArticle}/>
                    <Route path='/submit' component={NewsSubmit}/>
                    <Route path='/login' component={Authentication}/>
                    <Route path='/user/:id' component={StudentView}/>
                </Layout>
            </BrowserRouter>
        </Provider>
       );
  }
}

export default App;