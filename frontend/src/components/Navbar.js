//Imports from the node_modules
import React from 'react';
import { NavLink } from 'react-router-dom';
//Imports from the project
import AuthContext from '../context/auth-context';
import '../SCSS/navbar.scss';

//Dynamic Navbar component that changes if loged in
const Navbar = props => {
    
    const mobileMenuHandler = () => {
        document.getElementById("navbar").classList.toggle('d-inline-block')
    }

    return (
        <AuthContext.Consumer>
            {/* Using the AuthContext to access some app states only if token */}
            {(context) => {
                return (
                    <header className="main-navigation px-4 py-2 py-md-0 d-flex">
                        <div className="navbar-logo">
                            <NavLink to="/posts"><h1 className="d-inline-block">TakeCare!</h1></NavLink>
                            <div className="mobile-menu-button ml-4 pl-3 d-inline-block d-md-none">
                                <i onClick={mobileMenuHandler} className="fas fa-bars"></i>
                            </div>
                        </div>
                        <nav id="navbar" className="navbar-list">
                            <ul>
                                {!context.token && (
                                    <li>
                                        <NavLink to="/login">Login</NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink to="/posts">Posts</NavLink>
                                </li>
                                {context.token && (
                                    <React.Fragment>
                                        <li>
                                            <NavLink to={`/profile/${context.userId}`}>Profile</NavLink>
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