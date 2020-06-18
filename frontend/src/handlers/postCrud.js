import { useState, useEffect, useContext } from 'react';

import PostsContext from '../handlers/posts-context';
 
//Functions for see detail and comment
const showDetailHandler = (postId) => {
    this.setState(prevState => {
        const selectedPost = prevState.posts.find(post => post._id === postId);
        return { selectedPost: selectedPost };
    });
}

//Open the editting modal
const editingPostHandler = (postId) => {
    this.setState(prevState => {
        const editingPost = prevState.posts.find(post => post._id === postId);
        console.log("Editing Post... " + editingPost)
        return { editingPost: editingPost, editing: true };
    });
}

//Make a comment
const modalCommentHandler = () => {
}

//Prevent default submit
const submitHandler = (event) => {
    event.preventDefault();
}

//Edit a post
const modalEditHandler = () => {
    this.setState({ editing: true });
    //We get the posts's data using React references on the inputs
    const title = this.editTitleEl.current.value;
    const imageUrl = this.editImageEl.current.value;
    const description = this.editDescriptionEl.current.value;
    const postId = this.state.editingPost._id;

    console.log(postId + " " + title + " " + description + " " + imageUrl);
    //For editing a post
    const requestBody = {
        query: `
                mutation {
                    updatePost(_id: "${postId}", title: "${title}", description: "${description}", imageUrl: "${imageUrl}" ) {
                        _id
                        title
                        description
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
        })
        .catch(err => {
            throw err;
        });

    this.setState({ editing: false });
}

//Open the modal
const startCreatePostsHandler = () => {
    this.setState({ creating: true });
}

//Create new post
const modalConfirmHandler = () => {
    //We get the posts's data using React references on the inputs
    const title = this.titleEl.current.value;
    const imageUrl = this.imageEl.current.value;
    const description = this.descriptionEl.current.value;

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
                    createPost(postInput: {title: "${title}", description: "${description}", imageUrl: "${imageUrl}"} ) {
                        _id
                        title
                        description
                        imageUrl
                        createdAt
                        creator {
                            _id
                            username
                            email
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
                console.log('Error al crear')
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const createdPost = resData.data.createPost;
            this.setState(prevState => {
                const updatedPosts = [...prevState.posts];
                updatedPosts.push(createdPost);

                return { posts: updatedPosts };
            });
        })
        .catch(err => {
            throw err;
        });

    this.setState({ creating: false });
}

//Close the modal
const modalCancelHandler = () => {
    this.setState({ creating: false, selectedPost: null, editing: false });
}

//Get all posts
const fetchPosts = () => {
    this.setState({ isLoading: true })
    const requestBody = {
        query: `
                query {
                    posts {
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
        const resPostsData = resData.data.posts;
        this.setState({ posts: resPostsData, isLoading: false })
        console.log(this.state.posts);

    })
    .catch(err => {
        this.setState({ isLoading: false });
        throw err;
    });
}

exports.fetchPosts = fetchPosts;
exports.modalConfirmHandler = modalConfirmHandler;
exports.startCreatePostsHandler = startCreatePostsHandler;
exports.modalEditHandler = modalEditHandler;
exports.modalCommentHandler = modalCommentHandler;
exports.editingPostHandler = editingPostHandler;
exports.showDetailHandler = showDetailHandler;
exports.submitHandler = submitHandler;
exports.modalCancelHandler = modalCancelHandler;

//import { fetchPosts, modalConfirmHandler, modalCancelHandler, modalEditHandler, modalCoommentHandler, showDetailHandler, editingPostHandler, submitHandler, startCreatePostsHandler } from '../handlers/postCrud';
