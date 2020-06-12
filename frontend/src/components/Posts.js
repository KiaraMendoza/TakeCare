//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import Modal from '../modal/modal';
import Overlay from './Overlay';
import AuthContext from '../context/auth-context';
import PostsList from '../components/Posts/PostsList';
import PostForm from '../components/Posts/PostForm';
import PostDetail from '../components/Posts/PostDetail';
import PostSingle from './Posts/PostSingle';
import CategoriesAside from '../components/Asides/Categories';
import InfoAside from '../components/Asides/Info';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
import { Redirect, NavLink } from 'react-router-dom';

class PostsPage extends Component {
    state = {
        creating: false,
        posts: [],
        isLoading: false,
        selectedPost: null,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.titleEl = React.createRef();
        this.imageEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = () => {
        this.setState({isLoading: true})
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

    //Open the modal
    startCreatePostsHandler = () => {
        this.setState({ creating: true });
    }

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
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedPost: null });
    }


    //Functions for see detail and comment
    showDetailHandler = (postId) => {
        this.setState(prevState => {
            const selectedPost = prevState.posts.find(post => post._id === postId);
            return { selectedPost: selectedPost };
        });
    }

    modalCommentHandler = () => {

    }

    render() {

        return (
            <React.Fragment>
                <div className="posts-container row mx-0">
                    <aside className="categories-aside d-none d-md-flex col-md-2"><CategoriesAside /></aside>
                    <div className="post-page-content col-12 col-md-10 col-xl-8 px-0">
                        <div className="posts-control text-center">
                            <h1>Recent Posts</h1>
                            {this.context.token &&
                                <button className="btn btn-primary" onClick={this.startCreatePostsHandler}>Create a new post!</button>
                            }
                        </div>
                        {this.state.isLoading
                            ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                            : <section className="posts-list-container mt-5">
                                <PostsList onDetail={this.showDetailHandler} posts={this.state.posts} authUserId={this.context.userId} authUserRol={this.context.userRol} />
                            </section>
                        }
                        {this.state.creating &&
                            <Overlay />
                        }
                        {this.state.creating &&
                            <Modal title="Add a new Post" canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalConfirmHandler}>
                                <PostForm submitHandler={this.submitHandler} titleEl={this.titleEl} descriptionEl={this.descriptionEl} imageEl={this.imageEl} />
                            </Modal>
                        }
                        {this.state.selectedPost &&
                            <Redirect to={`/posts/${this.state.selectedPost._id}`} />
                        }
                    </div>
                    <aside className="info-aside d-none d-xl-flex col-xl-2 pl-0"><InfoAside /></aside>
                </div>
            </React.Fragment>
        )
    }
}

export default PostsPage;