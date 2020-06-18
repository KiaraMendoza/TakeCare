//Imports from the node_modules
import React, { useEffect, useState, useRef, useContext } from 'react';
//Imports from the project
import Modal from '../modal/modal';
import Overlay from './Overlay';
import AuthContext from '../context/auth-context';
import PostsContext from '../context/posts-context';
import PostsList from '../components/Posts/PostsList';
import PostForm from '../components/Posts/PostForm';
import CategoriesAside from '../components/Asides/Categories';
import InfoAside from '../components/Asides/Info';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
import { Redirect, NavLink } from 'react-router-dom';
import { useFetchPosts, startCreatePostsHandler } from '../handlers/postCrud';

const PostsPage = () => {
    // state = {
    //     creating: false,
    //     posts: [],
    //     isLoading: false,
    //     selectedPost: null,
    //     editing: false,
    //     editingPost: null,
    // }

    useContext(AuthContext);
    useContext(PostsContext);

    // constructor(props) {
    //     super(props);

    //     this.titleEl = React.createRef();
    //     this.imageEl = React.createRef();
    //     this.descriptionEl = React.createRef();

    //     this.editTitleEl = React.createRef();
    //     this.editImageEl = React.createRef();
    //     this.editDescriptionEl = React.createRef();
    // }
    const titleEl = useRef(null);
    const imageEl = useRef(null);
    const descriptionEl = useRef(null);
    
    const editTitleEl = useRef(null);
    const editImageEl = useRef(null);
    const editDescriptionEl = useRef(null);

    const [setPosts] = useFetchPosts();

    //Open the modal
    startCreatePostsHandler();

    //Create new post
    modalConfirmHandler = () => {
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
            console.log(resData.data);
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

    //Edit a post
    modalEditHandler = () => {
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

    //Close the modal
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedPost: null, editing: false });
    }


    //Functions for see detail and comment
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

    submitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <React.Fragment>
            <div className="posts-container row mx-0 position-relative">
                {(context.creating || context.editing) &&
                    <Overlay />
                }
                {context.creating &&
                    <Modal title="Add a new Post" canCancel onCancel={modalCancelHandler} canConfirm onConfirm={modalConfirmHandler}>
                    <PostForm submitHandler={submitHandler} titleEl={titleEl} descriptionEl={descriptionEl} imageEl={imageEl} />
                    </Modal>
                }
                {(context.editing && context.editingPost) &&
                    <Modal title={`Editing ${context.editingPost.title}`} canCancel onCancel={modalCancelHandler} canConfirm onConfirm={modalEditHandler}>
                    <PostForm submitHandler={submitHandler} titleEl={editTitleEl} descriptionEl={editDescriptionEl} imageEl={editImageEl} />
                    </Modal>
                }
                <aside className="categories-aside d-none d-md-flex col-md-2"><CategoriesAside /></aside>
                <div className="post-page-content col-12 col-md-10 col-xl-8 px-0">
                    <div className="posts-control text-center">
                        <h1>Recent Posts</h1>
                        {context.token &&
                            <button className="btn btn-primary" onClick={startCreatePostsHandler}>Create a new post!</button>
                        }
                    </div>
                    {context.isLoading
                        ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                        : <section className="posts-list-container mt-5">
                            <PostsList onDetail={showDetailHandler} onEditing={editingPostHandler} posts={context.posts} authUserId={context.userId} authUserRol={context.userRol} />
                        </section>
                    }
                    {context.selectedPost &&
                        <Redirect to={`/posts/${context.selectedPost._id}`} />
                    }
                </div>
                <aside className="info-aside d-none d-xl-flex col-xl-2 pl-0"><InfoAside /></aside>
            </div>
        </React.Fragment>
    )
    
}

export default PostsPage;