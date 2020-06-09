import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../context/auth-context';
import '../SCSS/navbar.scss';

const Navbar = props => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main-navigation">
                        <div className="navbar-logo">
                            <h1>MernGQL</h1>
                        </div>
                        <nav className="navbar-list">
                            <ul>
                                {!context.token && (
                                    <li>
                                        <NavLink to="/login">Login</NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink to="/events">Events</NavLink>
                                </li>
                                {context.token && (
                                    <React.Fragment>
                                        <li>
                                            <NavLink to="/bookings">Bookings</NavLink>
                                        </li>
                                        <li>
                                            <button className="btn btn-secondary" onClick={context.logout}>Logout</button>
                                        </li>
                                    </React.Fragment>
                                )}
                            </ul>
                        </nav>
                    </header>
                )
            }}
        </AuthContext.Consumer>
    )
}

export default Navbar;