//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import AuthContext from '../context/auth-context';


//Dynamic component for SignIn/SignUp
class LoginPage extends Component {
    state = {
        isLogin: true,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        
        this.usernameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

    }
    
    switchModeHandler = () => {
        this.setState({isLogin: !this.state.isLogin});
    }

    submitHandler = (event) => {
        event.preventDefault();
        const username = this.usernameEl.current.value;
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0) {
            console.log('Invalid or empty email');
            return;
        }

        if (password.trim().length === 0) {
            console.log('Invalid or empty password');
            return;
        }
        let requestBody;

        //For SignIn
        if (this.state.isLogin) {
            requestBody = {
                query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        userRol
                        token
                        tokenExpiration
                    }
                }
            `
            }
        }

        //For SignUp
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {username: "${username}", email: "${email}", password: "${password}"}) {
                            _id
                            username
                            rol
                            email
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            if (resData.data.createUser) {
                console.log('User created!');
            } else if (resData.data.login.token) {
                const resDataLogin = resData.data.login;
                this.context.login(
                    resDataLogin.token,
                    resDataLogin.userId,
                    resDataLogin.userRol,
                    resDataLogin.tokenExpiration
                )
            }
            this.setState({isLogin: true});
            return resData;
        })
        .catch(err => {
            throw err;
        });
    };

    render() {
        return (
            <div className="login-form-container container d-flex flex-column justify-content-center">
                <form className="login-form text-center" onSubmit={this.submitHandler}>
                    <h1 className="mb-5">{this.state.isLogin ? 'Sign in' : 'Sign up'}</h1>
                    <div className={`mt-4 flex-column mt-4 ${this.state.isLogin ? 'd-none' : 'd-flex'}`}>
                        <label htmlFor="username">Username</label>
                        <input className="form-control" type="username" id="username" placeholder="Mr. Example" ref={this.usernameEl} />
                    </div>
                    <div className="mt-4 d-flex flex-column mt-4">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" placeholder="example@example.com" ref={this.emailEl} />
                    </div>
                    <div className="d-flex flex-column mt-4">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" type="password" id="password" placeholder="StrongPassword!" ref={this.passwordEl} />
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-primary mr-3" type="submit">{this.state.isLogin ? 'Sign in' : 'Sign up'}</button>
                        <button className="btn btn-primary" type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Sign up' : 'Sign in'} </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginPage;