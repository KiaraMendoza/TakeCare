import React from 'react';
import { NavLink } from 'react-router-dom';
import '../SCSS/navbar.scss';

const Navbar = props => {
    return (
        <header>
            <div className="navbar-logo">
                <h1>MernGQL</h1>
            </div>
            <nav className="navbar-list">
                <ul>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;