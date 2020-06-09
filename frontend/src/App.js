import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import LoginPage from './components/Login';
import EventsPage from './components/Events';
import BookingsPage from './components/Bookings';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Navbar />
        <main>
          <Switch>
            <Redirect from="/" to="/login" exact />
            <Route path="/login" component={LoginPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
