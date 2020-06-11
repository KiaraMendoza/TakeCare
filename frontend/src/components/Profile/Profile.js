//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import PostsList from '../Posts/PostsList';
import AuthContext from '../../context/auth-context';
import '../../SCSS/profile.scss';
import '../../SCSS/loading-spinner.scss';

class ProfilePage extends Component {
    state = {
        posts: [],
        userData: {},
        isLoading: false,
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchUserData();
    }

    fetchUserData = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                    userData(_id : "${this.context.userId}") {
                        _id
                        username
                        email
                        rol
                        userProfileImg
                        createdPosts {
                            _id
                            title
                            description
                            createdAt
                            updatedAt
                            imageUrl
                        }
                    }
                }
            `
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const resUserData = resData.data.userData;
            this.setState({ posts: resUserData.createdPosts, userData: resUserData, isLoading: false })
            console.log(this.state.posts);
        })
        .catch(err => {
            this.setState({ isLoading: false });
            throw err;
        });
    }
    
    showDetailHandler = (postId) => {
        this.setState(prevState => {
            const selectedPost = prevState.posts.find(post => post._id === postId);
            return { selectedPost: selectedPost };
        });
    }
    
    render() {
        const userData = this.state.userData;
        return (
            <div className="profile-container">
                <div className="profile-detail">
                    <div className="detail-left-side">
                        <img src={`${this.state.userData.userProfileImg ? this.state.userData.userProfileImg : 'https://via.placeholder.com/350x320'}`} className="user-profile-image" width="150px"/>
                        <p>{this.state.userData.username}</p>
                    </div>
                </div>
                <div className="profile-posts">
                    {(this.state.isLoading) 
                        ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                        : <section className="posts-list-container mt-5">
                            <PostsList onDetail={this.showDetailHandler} posts={this.state.posts} userData={this.state.userData} authUserId={this.context.userId} authUserRol={this.context.userRol} />
                        </section>
                    }
                </div>
            </div>
        );
    }
};

export default ProfilePage;