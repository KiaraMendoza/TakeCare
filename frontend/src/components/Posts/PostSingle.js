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
                        creator {
                            _id
                            username
                            email
                            rol
                            userProfileImg
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
                <div className="post-single-container container-xl">
                    <div className="go-to-post-page">
                        <Link className="go-back-button" to="/posts">To posts page</Link>
                    </div>
                    <div className="post-data">
                        <p>{this.state.postData.title}</p>
                        <p>{this.state.postData.description}</p>
                        <img className="post-image" src={this.state.postData.imageUrl} />
                    </div>
                    <div className="post-comments">

                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default PostSingle;