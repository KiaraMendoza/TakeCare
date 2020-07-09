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
        editingComment: null,
        newCommentContent: null,
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchPostData();
        console.log(this.state.currentPostId)
        this.fetchForComments();
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
                    }
                }
            `
        }

        fetch(`${process.env.REACT_APP_SERVER_URL}graphql`, {
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
            
        })
        .catch(err => {
            this.setState({ isLoading: false, hasError: true });
            throw err;
        });
    }

    fetchForComments = () => {
        this.setState({ isLoading: true });

        let postId = this.props.match.params.id;

        if (this.props.post) {
            const postId = this.props.post._id;
        }

        const requestBody = {
            query: `
                query {
                    postComments(postId : "${postId}") {
                        _id
                        content
                        creator {
                            _id
                            username
                            imageUrl
                        }
                    }
                }
            `
        }

        fetch(`${process.env.REACT_APP_SERVER_URL}graphql`, {
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
                console.log('Error 404', resData);
                return;
            }
            const resCommentsData = resData.data.postComments;
            console.log('resCommentsData ', resCommentsData)
            this.setState({ commentsData: resCommentsData });
            this.setState({ isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false, hasError: true });
            throw err;
        });
    }

    addComment = () => {
        const commentContent = document.getElementById("comment-textarea").value;
        let postId = this.props.match.params.id;

        this.setState({ isLoading: true });

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
                            imageUrl
                        }
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating posts
        fetch(`${process.env.REACT_APP_SERVER_URL}graphql`, {
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
            console.log(resData.data.createComment);
            this.setState(prevState => {
                const updatedComments = [...prevState.commentsData];
                updatedComments.push(createdComment);

                return { commentsData: updatedComments };
            });

            this.setState({ isLoading: false });
            document.getElementById("comment-textarea").value = '';
            return createdComment;
        })
        .catch(err => {
            throw err;
        });
    }

    editingComment = (commentId) => {
        this.setState({ editingComment: commentId })
    }

    editComment = (content) => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                mutation {
                    updateComment(commentEditInput: { commentId: "${this.state.editingComment}", content: "${content}"} ) {
                        _id
                        content
                        creator {
                            _id
                            username
                            imageUrl
                        }
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating posts
        fetch(`${process.env.REACT_APP_SERVER_URL}graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Error al editar');
            }
            return res.json();
        })
        .then(resData => {
            const updatedComment = resData.data.updateComment;
            console.log(resData.data);
            this.setState({ isLoading: false });
            document.getElementById("comment-textarea").value = '';
            return updatedComment;
        })
        .catch(err => {
            throw err;
        });
    }

    _handleKeyDown = (e) => {
        console.log(e.target.innerHTML.trim());
        if (e.key === 'Enter') {
            this.setState({ isLoading: true });
            console.log(`Enter: ${e.target.innerHTML}`);
            const content = e.target.innerHTML.trim();
            this.editComment(content);
        }
    }

    deletingComment = (commentId) => {

        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation {
                    deleteComment( _id: "${commentId}" ) {
                        _id
                        content
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating posts
        fetch(`${process.env.REACT_APP_SERVER_URL}graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Error al borrar');
            }
            return res.json();
        })
        .then(resData => {
            const deletedComment = resData.data.deleteComment;
            console.log(resData.data);
            this.setState(prevState => {
                const updatedComments = [...prevState.commentsData];
                const filteredComments = updatedComments.filter(comment => comment._id != deletedComment._id);

                return { commentsData: filteredComments };
            });

            this.setState({ isLoading: false });
            document.getElementById("comment-textarea").value = '';
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

    LeftMenuHandler = () => {
        document.getElementById("left-aside").classList.toggle('see-left-aside');
        document.getElementById("right-aside").classList.remove('see-right-aside');
    };

    RightMenuHandler = () => {
        document.getElementById("right-aside").classList.toggle('see-right-aside');
        document.getElementById("left-aside").classList.remove('see-left-aside');
    };

    render() {
        console.log("Comments data" + this.state.commentsData)
        return (
            <React.Fragment>
                {this.state.hasError && <Redirect to="/404" />}
                <div className="post-single-container row mx-auto mx-lg-0 position-relative">
                    <div className="go-to-post-page position-absolute">
                        <Link className="go-back-button" to="/posts"><i className="fas fa-arrow-circle-left mr-2"></i>To posts page</Link>
                    </div>
                    <aside id="left-aside" className="categories-aside col-md-4 col-lg-3 col-xl-2"><CategoriesAside /></aside>
                    <div className="post-single-data px-5 col-12 col-md-8">
                        <div className="post-data mb-5">
                            <h1 className="pb-2">{this.state.postData.title}</h1>
                            <p>{this.state.postData.description}</p>
                            <p>Created by: {this.state.userData.username}</p>
                            <div className="image-background">
                                <img className="post-image mw-100" src={this.state.postData.imageUrl} alt="Current post image" />
                            </div>
                        </div>
                        <div className="post-comments px-0 justify-content-between my-5">
                            <div className="comments-title-container px-4"><h2>Comments:</h2></div>
                            <div className="comments px-4 pt-3">
                                {!this.state.isLoading &&
                                    this.state.commentsData.map(comment => { 
                                        return (
                                            <div className="comment mb-3" key={comment._id}>
                                                <div className="comment-user">
                                                    <a href={`/profile/${comment.creator._id}`}><i className="fas fa-user mr-2"></i>{comment.creator.username}</a>
                                                </div>
                                                <div className="comment-data">
                                                    <p contentEditable={(this.state.editingComment && this.context.userId == comment.creator._id) ? true : false} onKeyDown={this._handleKeyDown} suppressContentEditableWarning={true}>
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                <div className="comment-extras d-flex justify-content-between align-items-center mr-2">
                                                    <div className="comment-rates d-inline"><i className="far fa-heart mr-4"></i><i className="far fa-thumbs-down"></i></div>
                                                    {comment.creator._id == this.context.userId &&
                                                        <div className="comment-buttons d-inline">
                                                            <button onClick={this.editingComment.bind(this, comment._id)} className="btn btn-secondary mr-2">Edit</button>
                                                            <button onClick={this.deletingComment.bind(this, comment._id)} className="btn btn-danger">Delete</button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="comments-textarea-container">
                                <form onSubmit={this.submitHandler}>
                                    <textarea id="comment-textarea" rows="4" className="comments-textarea w-100 h-100" placeholder="Insert new comment" maxLength="550"></textarea>
                                </form>
                                <button className="btn btn-secondary w-50 rounded-0" onClick={this.cancelButton}>Cancel</button>
                                <button className="btn btn-primary w-50 rounded-0" onClick={this.addComment}>Send</button>
                            </div>
                        </div>
                    </div>
                    <aside id="right-aside" className="races-aside col-xl-2 pl-xl-0"><RacesAside /></aside>
                    <div className="see-aside-buttons right-aside-button position-fixed"><i onClick={this.RightMenuHandler} className="fas fa-align-right"></i></div>
                    <div className="see-aside-buttons left-aside-button position-fixed"><i onClick={this.LeftMenuHandler} className="fas fa-align-left"></i></div>
                </div>
            </React.Fragment>
        );
    }
};

export default PostSingle;