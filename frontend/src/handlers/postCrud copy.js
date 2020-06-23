import React, { Component, useState, useEffect, useContext, useRef } from 'react';

import Modal from '../modal/modal';
import Overlay from '../components/Overlay';
import AuthContext from '../context/auth-context';
import PostsList from '../components/Posts/PostsList';
import PostForm from '../components/Posts/PostForm';
import { Redirect, NavLink } from 'react-router-dom';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
import { useFetchWithToken } from '../helpers/fetchWithToken';
 
const usePostCrud = (props) => {
    const [postsList, setPosts] = useState([]);
    const [userData, setUserData] = useState({});
    const [creating, setIsCreating] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setIsEditing] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [typeFetch, setTypeFetch] = useState("");

    const auth = useContext(AuthContext);

    const titleEl = useRef(titleEl);
    const imageEl = useRef(imageEl);
    const descriptionEl = useRef(descriptionEl);
    const categoryEl = useRef(categoryEl);

    const editTitleEl = useRef(editTitleEl);
    const editImageEl = useRef(editImageEl);
    const editDescriptionEl = useRef(editDescriptionEl);
    const editCategoryEl = useRef(editCategoryEl);

    useEffect(() => {
        setPosts(props.posts);
        if (props.userDate) {
            setUserData(props.userData);
        }
    }, []);

    //Open the modal
    const startCreatePostsHandler = () => {
        return setIsCreating(true);
    }

    let requestBody = '';

    if (typeFetch === 'create') {
        //We get the posts's data using React references on the inputs
        const title = titleEl.current.value;
        const imageUrl = imageEl.current.value;
        const description = descriptionEl.current.value;
        const category = categoryEl.current.value;

        if (title.trim().length === 0 || description.trim().length === 0) {
            console.log('Something bad!');
            return;
        }

        //For creating a post
        const requestBody = {
            query: `
                mutation {
                    createPost(postInput: {title: "${title}", description: "${description}", imageUrl: "${imageUrl}", category: "${category}" } ) {
                        _id
                        title
                        description
                        category
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
    }

    if (typeFetch === 'edit') {
        //We get the posts's data using React references on the inputs
        const title = editTitleEl.current.value;
        const imageUrl = editImageEl.current.value;
        const description = editDescriptionEl.current.value;
        const category = editCategoryEl.current.value;
        const postId = editingPost._id;

        console.log(postId + " " + title + " " + description + " " + imageUrl);
        //For editing a post
        const requestBody = {
            query: `
                mutation {
                    updatePost(_id: "${postId}", title: "${title}", description: "${description}", imageUrl: "${imageUrl}", category: "${category}" ) {
                        _id
                        title
                        description
                        category
                        imageUrl
                        createdAt
                        updatedAt
                    }
                }
            `
        }
    }

    if (typeFetch === 'delete') {
        const postId = editingPost._id;
        //For editing a post
        const requestBody = {
            query: `
                mutation {
                    deletePost(_id: "${postId}") {
                        _id
                        creator {
                            _id
                        }
                    }
                }
            `
        }
    }

    const [isLoading, fetchedData] = useFetchWithToken(requestBody);

    //Create new post
    const useModalConfirmHandler = () => {

        setPosts(prevState => {
            const createdPost = fetchedData.createPost;
            const updatedPosts = [...prevState.postsList];
            updatedPosts.push(createdPost);

            return updatedPosts;
        });

        setIsCreating(false);
    }

    //Edit a post
    const useModalEditHandler = () => {
        setIsEditing(true);
        setTypeFetch('edit');

        setPosts(prevState => {
            const updatedPost = fetchedData.updatePost;
            const updatedPosts = [...prevState.postsList];
            updatedPosts.push(updatedPost);

            return updatedPosts;
        });

        setIsEditing(false);
    }

    //Delete a post
    const useModalDeleteHandler = () => {
        setIsEditing(true);
        setTypeFetch('delete');

        setPosts(prevState => {
            const deletedPost = fetchedData.deletedPost;
            const updatedPosts = [...prevState.postsList];
            updatedPosts.filter(post => post = deletedPost);

            return updatedPosts;
        });

        setIsEditing(false);
    }

    //Close the modal
    const modalCancelHandler = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedPost(null);
    }


    //Select a post to then check the PostSingle page of that post
    const showDetailHandler = (postId) => {
        setSelectedPost(prevState => {
            const selectedPost = prevState.posts.find(post => post._id === postId);
            console.log(selectedPost)
            return selectedPost;
        })
    }

    //Open the editting modal
    const editingPostHandler = (postId) => {
        setSelectedPost(prevState => {
            const editingPost = prevState.posts.find(post => post._id === postId);
            console.log("Editing Post... " + editingPost)
            return editingPost;
        })

        setIsEditing(true);
    }

    const modalCommentHandler = () => {

    }

    const submitHandler = (event) => {
        event.preventDefault();
    }

    
    console.log(`Props posts: ${props.posts}, Posts state: ${postsList}`);
    return (
        <React.Fragment>
            {(creating || editing) &&
                <Overlay />
            }
            {creating &&
                <Modal title="Add a new Post" canCancel onCancel={modalCancelHandler} canConfirm onConfirm={useModalConfirmHandler}>
                    <PostForm submitHandler={submitHandler} titleEl={titleEl} descriptionEl={descriptionEl} imageEl={imageEl} categoryEl={categoryEl} />
                </Modal>
            }
            {(editing && editingPost) &&
                <Modal title={`Editing ${editingPost.title}`} canDelete onDelete={useModalDeleteHandler} canCancel onCancel={modalCancelHandler} canConfirm onConfirm={useModalEditHandler}>
                    <PostForm submitHandler={submitHandler} titleEl={editTitleEl} descriptionEl={editDescriptionEl} imageEl={editImageEl} categoryEl={categoryEl}/>
                </Modal>
            }
            {props.canCreatePost &&
                <div className="posts-control text-center">
                    <h1>Recent Posts</h1>
                    {auth.token &&
                        <button className="btn btn-primary" onClick={startCreatePostsHandler}>Create a new post!</button>
                    }
                </div>
            }
            <section className="posts-list-container mt-5">
                <PostsList onDetail={showDetailHandler} onEditing={editingPostHandler} posts={postsList} userData={userData} authUserId={auth.userId} authUserRol={auth.userRol} />
            </section>
            {selectedPost &&
                <Redirect to={`/posts/${selectedPost._id}`} />
            }
        </React.Fragment >
    )
}

export default usePostCrud;