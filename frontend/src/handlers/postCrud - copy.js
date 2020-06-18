import { useState, useEffect, useContext } from 'react';

import PostsContext from '../handlers/posts-context';
 
//Functions for see detail and comment
export const showDetailHandler = (postId, postsState) => {
    useContext(PostsContext);
    context.selectedPost = prevState.posts.find(post => post._id === postId);
    return context.selectedPost;
}

//Open the editting modal
export const editingPostHandler = (postId) => {
    useContext(PostsContext);
    context.isEditing = true;
    context.editingPost = prevState.posts.find(post => post._id === postId);
    return context.editingPost;
}

//Make a comment
export const useModalCommentHandler = () => {
}

//Prevent default submit
export const SubmitHandler = (event) => {
    event.preventDefault();
}

//Edit a post
export const useModalEditHandler = () => {
    useContext(PostsContext);
    context.isEditing = true;
    const [updatedPostData, setUpdatedPostData] = useState(null);
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
            console.log(resData.data);
            const updatedPost = resData.data.updatePost;
            setUpdatedPostData(updatedPost);
            context.isEditing = false;
        })
        .catch(err => {
            setIsEditing(false);
            throw err;
        });
    return [updatedPostData];
}

//Open the modal
export const startCreatePostsHandler = () => {
    useContext(PostsContext);
    return context.isCreating = true;
}

//Create new post
export const useModalConfirmHandler = (AuthToken) => {
    useContext(PostsContext);
    context.isCreating = true;
    const [createdPost, setCreatedPost] = useState(null);
    const [updatedPosts, setUpdatedPosts] = useState(context.posts);

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
    const token = AuthToken;

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
            // const createdPost = resData.data.createPost;
            // this.setState(prevState => {
            //     const updatedPosts = [...prevState.posts];
            //     updatedPosts.push(createdPost);

            //     return { posts: updatedPosts };
            // });
            setCreatedPost(resData.data.createdPost);
            setUpdatedPosts(prevState => {
                [...prevState, createdPost]
            });
            context.isCreating = false;
            return;
        })
        .catch(err => {
            throw err;
        });

    return [createdPost, updatedPosts];
}

//Close the modal
export const useModalCancelHandler = () => {
    useContext(PostsContext);
    context.isCreating = false;
    context.isEditing = false; 
    context.selectedPost = null;
    return;
};

//Get all posts
export const useFetchPosts = () => {
    useContext(PostsContext);
    context.IsLoading = true;
    const [postsState, setPosts] = useState(null);
    
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
    useEffect(() => { 
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
            setPosts(resPostsData);
            context.posts = postsState;
            context.IsLoading = false;

        })
        .catch(err => {
            context.IsLoading = false;
            throw err;
        });
    }, []);
    return [setPosts];
}

//import { fetchPosts, modalConfirmHandler, modalCancelHandler, modalEditHandler, modalCoommentHandler, showDetailHandler, editingPostHandler, submitHandler, startCreatePostsHandler } from '../handlers/postCrud';