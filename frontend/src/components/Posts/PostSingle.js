//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import '../../SCSS/posts.scss';
import { Redirect, Link } from 'react-router-dom';

class PostSingle extends Component {
    state = {
        isLoading: false,
        postData: {},
    }

    componentDidMount(){
        this.fetchPostData();
    }

    fetchPostData() {
        this.setState({ isLoading: true });

        let postId = this.props.match.params.id;
        if (this.props.post) {
            const postId = this.props.post._id;
        }

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
            this.setState({ postData: resPostData, isLoading: false });
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
                <div className="post-single-container container row mx-auto mx-lg-0 position-relative">
                    <div className="go-to-post-page position-absolute">
                        <Link className="go-back-button" to="/posts">To posts page</Link>
                    </div>
                    <div className="post-data col-12 col-lg-8 mb-5 mb-lg-0">
                        <h1>{this.state.postData.title}</h1>
                        <p>{this.state.postData.description}</p>
                        <img className="post-image w-100" src={this.state.postData.imageUrl} alt="Current post image" />
                    </div>
                    <div className="col"></div>
                    <div className="post-comments col-12 col-lg-3 px-0 justify-content-between my-5 mt-lg-0">
                        <div className="comments-title-container px-4"><h2>Comments:</h2></div>
                        <div className="comments px-4 pt-3">
                            <div className="comment">
                                <div className="comment-user">
                                    <p><i>Icon </i>Uri</p>
                                </div>
                                <div className="comment-data">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                        Suspendisse sit amet bibendum est, ut consequat nunc. 
                                        Aliquam sit amet augue id quam molestie interdum sed sit amet ex.
                                    </p>
                                </div>
                                <div className="comment-extras">
                                    <i>Like </i><i>Dislike</i>
                                </div>
                            </div>
                            <div className="comment">
                                <div className="comment-user">
                                    <p><i>Icon </i>Uri</p>
                                </div>
                                <div className="comment-data">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Suspendisse sit amet bibendum est, ut consequat nunc.
                                        Aliquam sit amet augue id quam molestie interdum sed sit amet ex.
                                    </p>
                                </div>
                                <div className="comment-extras">
                                    <i>Like </i><i>Dislike</i>
                                </div>
                            </div>
                        </div>
                        <div className="comments-textarea-container">
                            <textarea className="comments-textarea w-100 h-100" placeholder="Insert new comment"></textarea>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default PostSingle;