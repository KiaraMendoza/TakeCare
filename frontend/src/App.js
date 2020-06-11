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
import ProfilePage from './components/Profile/Profile';

class App extends Component {
  state = {
    token: null,
    userId: null,
    userRol: null
  };

  componentDidMount() {
    if (!localStorage.getItem("state-token") == null) {
      this.setState({ token: localStorage.getItem("state-token"), userId: localStorage.getItem("state-userId"), userRol: localStorage.getItem("state-userRol")});
    }
  }
  
  login = (token, userId, userRol, tokenExpiration) => {
    this.setState({ token: token, userId: userId, userRol: userRol });
    localStorage.setItem("state-token", this.state.token);
    localStorage.setItem("state-userId", this.state.userId);
    localStorage.setItem("state-userRol", this.state.userRol);
  };

  logout = () => {
    this.setState({ token: null, userId: null, userRol: null });
    localStorage.setItem("state-token", null);
    localStorage.setItem("state-userId", null);
    localStorage.setItem("state-userRol", null);
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, userRol: this.state.userRol, login: this.login, logout: this.logout}}>
            <Navbar />
              <main className="main-content">
                <Switch>
                  <Route path="/posts" component={PostsPage} />
                  {!this.state.token && <Redirect from="/" to="/login" exact />}
                  {!this.state.token && <Route path="/login" component={LoginPage} />}
                  {this.state.token && <Redirect from="/login" to="/posts" exact />}
                  {this.state.token && <Route to={`/profile/${this.state.userId}`} component={ProfilePage} />}
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
