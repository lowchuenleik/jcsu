import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import store from './stores/store';
import Home from './components/layouts/Home';
import Layout from "./components/layouts/Layout";
import About from './components/layouts/About';
import NewsItemDetail from './components/presentation/NewsItemDetail';
import NewsArticle from "./components/containers/NewsArticle";

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path='/news/:id' component={NewsArticle}/>
                </Layout>
            </BrowserRouter>
        </Provider>
       );
  }
}

export default App;