import { useState, useEffect, useContext } from 'react';
import React, { Component } from 'react';

import Modal from '../modal/modal';
import Overlay from '../components/Overlay';
import AuthContext from '../context/auth-context';
//import PostsContext from '../handlers/posts-context';
import PostsList from '../components/Posts/PostsList';
import PostForm from '../components/Posts/PostForm';
import { Redirect, NavLink } from 'react-router-dom';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
//import useFetchWithToken from '../helpers/fetchWithToken';
 
class PostCrud extends Component {
    state = {
        posts: [],
        userData: {},
        creating: false,
        selectedPost: null,
        editing: false,
        editingPost: null,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.titleEl = React.createRef();
        this.imageEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.categoryEl = React.createRef();

        this.editTitleEl = React.createRef();
        this.editImageEl = React.createRef();
        this.editDescriptionEl = React.createRef();
        this.editCategoryEl = React.createRef();
    }
    
    componentDidMount() {
        this.setState({ posts: this.props.posts });
        if (this.props.userData) {
            this.setState({ userData: this.props.userData })
        }
    }

    //Open the modal
    startCreatePostsHandler = () => {
        this.setState({ creating: true });
    }

    //Create new post
    modalConfirmHandler = () => {
        this.setState({ isLoading: true });
        //We get the posts's data using React references on the inputs
        const title = this.titleEl.current.value;
        const imageUrl = this.imageEl.current.value;
        const description = this.descriptionEl.current.value;
        const category = this.categoryEl.current.value;

        if (title.trim().length === 0 || description.trim().length === 0) {
            console.log('Something bad!');
            return;
        }

        let post = { title, description };

        if (imageUrl) {
            const post = { title, imageUrl, description };
        }

        //For creating a post
        const requestBody = {
            query: `
                mutation {
                    createPost(postInput: {title: "${title}", description: "${description}", imageUrl: "${imageUrl}", category: "${category}" } ) {
                        _id
                        title
                        description
                        category {
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
                const createdPost = resData.data.createPost;
                console.log(resData.data);
                this.setState(prevState => {
                    const updatedPosts = [...prevState.posts];
                    updatedPosts.push(createdPost);

                    return { posts: updatedPosts };
                });
                this.setState({ isLoading: false });
            })
            .catch(err => {
                this.setState({ isLoading: false });
                throw err;
            });

        this.setState({ creating: false });
    }

    //Edit a post
    modalEditHandler = () => {
        this.setState({ editing: true });
        //We get the posts's data using React references on the inputs
        const title = this.editTitleEl.current.value;
        const imageUrl = this.editImageEl.current.value;
        const description = this.editDescriptionEl.current.value;
        const category = this.editCategoryEl.current.value;
        const postId = this.state.editingPost._id;

        console.log(postId + " " + title + " " + description + " " + imageUrl);
        //For editing a post
        const requestBody = {
            query: `
                mutation {
                    updatePost(_id: "${postId}", title: "${title}", description: "${description}", imageUrl: "${imageUrl}", category: "${category}" ) {
                        _id
                        title
                        description
                        category {
                            _id
                            name
                        }
                        imageUrl
                        createdAt
                        updatedAt
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating/editing posts
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
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const updatedPost = resData.data.updatePost;
            console.log(resData.data)
            return updatedPost;
            
        })
        .catch(err => {
            throw err;
        });

        this.setState({ editing: false });
    }

    //Delete a post
    modalDeleteHandler = () => {
        this.setState({ editing: true, isLoading: true });

        const postId = this.state.editingPost._id;
        //For editing a post
        const requestBody = {
            query: `
                mutation {
                    deletePost(_id: "${postId}") {
                        _id
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating/editing posts
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
                    throw new Error('Failed!');
                }
                const resToJson = res.json();
                console.log(resToJson);
                return resToJson;
            })
            .then(resData => {
                const deletedPost = resData.data;
                console.log(resData.data);
                this.setState(prevState => {
                    const updatedPosts = [...prevState.posts];
                    updatedPosts.filter(post => {
                        console.log(post._id, deletedPost.deletePost._id)
                        const notDeleted = post._id != deletedPost.deletePost._id;
                        return notDeleted;
                    });

                    return { posts: updatedPosts };
                });
                this.setState({ isLoading: false });
            })
            .catch(err => {
                throw err;
            });

        this.setState({ editing: false });
    }

    //Close the modal
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedPost: null, editing: false });
    }


    //Select a post to then check the PostSingle page of that post
    showDetailHandler = (postId) => {
        this.setState(prevState => {
            const selectedPost = prevState.posts.find(post => post._id === postId);
            console.log(selectedPost)
            return { selectedPost: selectedPost };
        });
    }

    //Open the editting modal
    editingPostHandler = (postId) => {
        this.setState(prevState => {
            const editingPost = prevState.posts.find(post => post._id === postId);
            console.log("Editing Post... " + editingPost)
            return { editingPost: editingPost, editing: true };
        });
    }

    modalCommentHandler = () => {

    }

    submitHandler = (event) => {
        event.preventDefault();
    }

    render() {
        console.log(`Props posts: ${this.props.posts}, Posts state: ${this.state.posts}`)
        return (
            <React.Fragment>
                {(this.state.creating || this.state.editing) &&
                    <Overlay />
                }
                {this.state.creating &&
                    <Modal title="Add a new Post" canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalConfirmHandler}>
                        <PostForm submitHandler={this.submitHandler} titleEl={this.titleEl} descriptionEl={this.descriptionEl} imageEl={this.imageEl} categoryEl={this.categoryEl} />
                    </Modal>
                }
                {(this.state.editing && this.state.editingPost) &&
                    <Modal title={`Editing ${this.state.editingPost.title}`} canDelete onDelete={this.modalDeleteHandler} canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalEditHandler}>
                        <PostForm submitHandler={this.submitHandler} titleEl={this.editTitleEl} descriptionEl={this.editDescriptionEl} imageEl={this.editImageEl} categoryEl={this.editCategoryEl}/>
                    </Modal>
                }
                {this.props.canCreatePost &&
                    <div className="posts-control text-center">
                        <h1>{this.props.title ? this.props.title : 'Recent posts'}</h1>
                        <p>{this.props.description ? this.props.description : ''}</p>
                        {this.context.token &&
                            <button className="btn btn-primary" onClick={this.startCreatePostsHandler}>Create a new post!</button>
                        }
                    </div>
                }
                {!this.state.isLoading &&
                    <section className="posts-list-container mt-5">
                        <PostsList onDetail={this.showDetailHandler} onEditing={this.editingPostHandler} posts={this.state.posts} userData={this.state.userData} authUserId={this.context.userId} authUserRol={this.context.userRol} />
                    </section>
                }
                {this.state.selectedPost &&
                    <Redirect to={`/posts/${this.state.selectedPost._id}`} />
                }
            </React.Fragment >
        )
    }
}

export default PostCrud;