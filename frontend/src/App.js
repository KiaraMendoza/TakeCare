import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
//import "fontawesome-free/css/all.css";

import './SCSS/App.scss';
import AuthContext from './context/auth-context';
import LoginPage from './components/Login';
import EventsPage from './components/Events';
import BookingsPage from './components/Bookings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
            <Navbar />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/login" exact />}
                {!this.state.token && <Redirect from="/bookings" to="/login" exact />}
                {!this.state.token && <Route path="/login" component={LoginPage} />}
                {this.state.token && <Redirect from="/login" to="/events" exact />}
                <Route path="/events" component={EventsPage} />
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
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
