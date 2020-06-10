import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
//import "fontawesome-free/css/all.css";

import './SCSS/App.scss';
import AuthContext from './context/auth-context';
import LoginPage from './components/Login';
import PostsPage from './components/Posts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

class App extends Component {
  state = {
    token: null,
    userId: null,
    userRol: null
  };

  login = (token, userId, userRol, tokenExpiration) => {
    this.setState({ token: token, userId: userId, userRol: userRol });
  };

  logout = () => {
    this.setState({ token: null, userId: null, userRol: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, userRol: this.state.userRol, login: this.login, logout: this.logout}}>
            <Navbar />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/login" exact />}
                {!this.state.token && <Route path="/login" component={LoginPage} />}
                {this.state.token && <Redirect from="/login" to="/posts" exact />}
                <Route path="/posts" component={PostsPage} />
              </Switch>
            </main>
          </AuthContext.Provider>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
