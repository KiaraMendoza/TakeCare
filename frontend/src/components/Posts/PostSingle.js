//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import { Redirect, Link } from 'react-router-dom';
import CategoriesAside from '../Asides/Categories';
import RacesAside from '../Asides/Races';
import AuthContext from '../../context/auth-context';

class PostSingle extends Component {
    state = {
        isLoading: false,
        postData: {},
        userData: {},
        raceData: {},
        categoryData: {},
        commentsData: [],
        currentPostId: "",
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchPostData();
        console.log(this.state.currentPostId)
    }

    fetchPostData() {
        this.setState({ isLoading: true });

        let postId = this.props.match.params.id;
        
        if (this.props.post) {
            const postId = this.props.post._id;
            this.setState({ currentPostId: `${postId}` });
        }
        this.setState({ currentPostId: `${postId}` });

        const requestBody = {
            query: `
                query {
                    postData(_id : "${postId}") {
                        _id
                        title
                        description
                        createdAt
                        updatedAt
                        imageUrl
                        race {
                            _id
                            name
                        }
                        category {
                            _id
                            name
                        }
                        creator {
                            _id
                            username
                            email
                            rol
                            imageUrl
                        }
                        comments {
                            _id
                            content
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
                this.setState({ hasError: true });
            }
            return res.json();
        })
        .then(resData => {
            if (!resData.data) {
                this.setState({ isLoading: false, hasError: true });
                console.log('Error 404', resData)
                return;
            }
            const resPostData = resData.data.postData;
            console.log('resPostData ', resPostData)
            this.setState({ postData: resPostData, isLoading: false, userData: resPostData.creator, raceData: resPostData.race, categoryData: resPostData.category });
            this.setState({ commentsData: resPostData.comments })
        })
        .catch(err => {
            this.setState({ isLoading: false, hasError: true });
            throw err;
        });
    }

    addComment = () => {
        const commentContent = document.getElementById("comment-textarea").value;
        let postId = this.props.match.params.id;

        if (this.props.post) {
            const postId = this.props.post._id;
            this.setState({ currentPostId: `${postId}` });
        }

        const requestBody = {
            query: `
                mutation {
                    createComment(commentInput: { postId: "${postId}", content: "${commentContent}"} ) {
                        _id
                        content
                        creator {
                            _id
                            username
                        }
                        post {
                            _id
                            title
                            description
                        }
                        createdAt
                        updatedAt
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating posts
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                console.log('Error al crear');
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const createdComment = resData.data.createComment;
            console.log(resData.data);
            return createdComment;
        })
        .catch(err => {
            throw err;
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
    }

    cancelButton = () => {
        return document.getElementById("comment-textarea").value = '';
    }

    render() {
        console.log("Comments data" + this.state.commentsData)
        return (
            <React.Fragment>
                {this.state.hasError && <Redirect to="/404" />}
                <div className="post-single-container row mx-auto mx-lg-0 position-relative">
                    <div className="go-to-post-page position-absolute">
                        <Link className="go-back-button" to="/posts"><i className="fas fa-arrow-circle-left mr-2"></i>To posts page</Link>
                    </div>
                    <div className="col-lg-2 d-none d-lg-flex">
                        <CategoriesAside />
                    </div>
                    <div className="post-single-data col-12 col-lg-8">
                        <div className="post-data mb-5">
                            <h1>{this.state.postData.title}</h1>
                            <p>{this.state.postData.description}</p>
                            <p>Created by: {this.state.userData.username}</p>
                            <div className="image-background">
                                <img className="post-image mw-100" src={this.state.postData.imageUrl} alt="Current post image" />
                            </div>
                        </div>
                        <div className="post-comments px-0 justify-content-between my-5">
                            <div className="comments-title-container px-4"><h2>Comments:</h2></div>
                            <div className="comments px-4 pt-3">
                                {this.state.commentsData.map(comment => { 
                                    return (
                                        <div className="comment mb-3">
                                            <div className="comment-user">
                                                <p><i class="fas fa-user mr-2"></i>Uri</p>
                                            </div>
                                            <div className="comment-data">
                                                <p>{comment.content}</p>
                                            </div>
                                            <div className="comment-extras">
                                                <i class="far fa-heart mr-4"></i><i class="far fa-thumbs-down"></i>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="comments-textarea-container">
                                <form onSubmit={this.submitHandler}>
                                    <textarea id="comment-textarea" className="comments-textarea w-100 h-100" placeholder="Insert new comment"></textarea>
                                </form>
                                <button className="btn btn-secondary w-50 rounded-0" onClick={this.cancelButton}>Cancel</button>
                                <button className="btn btn-primary w-50 rounded-0" onClick={this.addComment}>Send</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 d-none d-lg-flex">
                        <RacesAside />
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default PostSingle;