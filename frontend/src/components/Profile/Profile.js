//Imports from the node_modules
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
//Imports from the project
import PostsList from '../Posts/PostsList';
import AuthContext from '../../context/auth-context';
import PostCrud from '../../handlers/postCrud';

class ProfilePage extends Component {
    state = {
        posts: [],
        userData: {},
        isLoading: false,
        hasError: false,
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchUserData();
    }

    fetchUserData = () => {
        this.setState({ isLoading: true });

        let userId = this.props.match.params.id;
        if (this.context.token) {
            const userId =  this.context.userId;
        }

        const requestBody = {
            query: `
                query {
                    userData(_id : "${userId}") {
                        _id
                        username
                        email
                        rol
                        imageUrl
                        createdPosts {
                            _id
                            title
                            description
                            category {
                                _id
                                name
                            }
                            race {
                                _id
                                name
                            }
                            createdAt
                            updatedAt
                            imageUrl
                            creator {
                                _id
                                username
                                email
                                rol
                            }
                        }
                    }
                }
            `
        }

        fetch('https://takecare-socialapp.herokuapp.com:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({ hasError: true });
            }
            return res.json();
        })
        .then(resData => {
            if (!resData.data) {
                this.setState({ isLoading: false, hasError: true });
                return;
            }
            const resUserData = resData.data.userData;
            this.setState({ posts: resUserData.createdPosts, userData: resUserData, isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false, hasError: true });
            throw err;
        });
    }

    
    render() {
        return (
            <React.Fragment>
                {this.state.hasError && <Redirect to="/404" />}
                <div className="profile-container">
                    <div className="profile-detail p-5 row mx-auto container">
                        <div className="detail-left-side col-12 col-md-4 text-center">
                            <img src={`${this.state.userData.imageUrl ? this.state.userData.imageUrl : 'https://via.placeholder.com/350x320'}`} className="user-profile-image" width="150px" />
                            <p>{this.state.userData.username}</p>
                        </div>
                        <div className="detail-right-side col-12 col-md-8">
                            <p>About me:</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis nunc libero, a cursus felis tristique volutpat. Duis sit amet nunc libero. Nullam vehicula augue a felis tristique efficitur. In nunc ipsum, luctus et ipsum at, porttitor tempus ante. Maecenas at dictum tortor. Nunc lobortis ornare arcu, a tempus dolor molestie vitae. Vestibulum eget auctor risus. Curabitur porta suscipit arcu, sed scelerisque tellus fringilla eu.</p>
                        </div>
                    </div>
                    <div className="profile-posts">
                        {this.state.isLoading
                            ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                            : <PostCrud posts={this.state.posts} userData={this.state.userData} />
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default ProfilePage;