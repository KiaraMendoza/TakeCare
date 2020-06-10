//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import Modal from '../modal/modal';
import Overlay from './Overlay';
import AuthContext from '../context/auth-context';
import PostsList from '../components/Posts/PostsList';
import '../SCSS/posts.scss';

class PostsPage extends Component {
    state = {
        creating: false,
        posts: [],
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
            this.setState({ posts: resPostsData })
            console.log(this.state.posts);

        })
        .catch(err => {
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
                console.log(res);
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data.createPost);
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
        this.setState({ creating: false });
    }

    render() {

        return (
            <React.Fragment>
                <div className="posts-control text-center">
                    <h1>Recent Posts</h1>
                    {this.context.token &&
                        <button className="btn btn-primary" onClick={this.startCreatePostsHandler}>Create a new post!</button>
                    }
                </div>
                {this.state.creating &&
                    <Overlay />
                }
                {this.state.creating &&
                    <Modal title="Add a new Post" canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalConfirmHandler}>
                        <form className="posts-form text-center" onSubmit={this.submitHandler}>
                            <div className="mt-4 d-flex flex-column mt-4">
                                <label htmlFor="title">Title</label>
                                <input className="form-control" type="text" id="title" ref={this.titleEl} />
                            </div>
                            <div className="mt-4 d-flex flex-column mt-4">
                                <label htmlFor="description">Description</label>
                                <textarea className="form-control" rows="4" id="description" ref={this.descriptionEl} />
                            </div>
                            <div className="mt-4 d-flex flex-column mt-4">
                                <label htmlFor="imageUrl">Image url</label>
                                <input className="form-control" type="text" id="image" ref={this.imageEl} />
                            </div>
                        </form>
                    </Modal>
                }
                <section className="posts-list-container mt-5">
                    <PostsList posts={this.state.posts} authUserId={this.context.userId} authUserRol={this.context.userRol} />
                </section>
            </React.Fragment>
        )
    }
}

export default PostsPage;