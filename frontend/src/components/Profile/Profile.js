//Imports from the node_modules
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
//Imports from the project
import PostsList from '../Posts/PostsList';
import PostForm from '../Posts/PostForm';
import Modal from '../../modal/modal';
import AuthContext from '../../context/auth-context';
import '../../SCSS/profile.scss';
import '../../SCSS/loading-spinner.scss';

class ProfilePage extends Component {
    state = {
        posts: [],
        userData: {},
        isLoading: false,
        hasError: false,
        selectedPost: null,
        editing: false,
        editingPost: null,
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchUserData();
    }

    fetchUserData = () => {
        this.setState({ isLoading: true });

        let userId = this.props.match.params.id;
        if (this.context.token) {
            const userId =  this.context.userId;
        }

        const requestBody = {
            query: `
                query {
                    userData(_id : "${userId}") {
                        _id
                        username
                        email
                        rol
                        userProfileImg
                        createdPosts {
                            _id
                            title
                            description
                            createdAt
                            updatedAt
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
                return;
            }
            const resUserData = resData.data.userData;
            this.setState({ posts: resUserData.createdPosts, userData: resUserData, isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false, hasError: true });
            throw err;
        });
    }
    
    showDetailHandler = (postId) => {
        this.setState(prevState => {
            const selectedPost = prevState.posts.find(post => post._id === postId);
            return { selectedPost: selectedPost };
        });
    }

    //Prevent default submit
    submitHandler = (event) => {
        event.preventDefault();
    }

    //Open the editting modal
    editingPostHandler = (postId) => {
        this.setState(prevState => {
            const editingPost = prevState.posts.find(post => post._id === postId);
            console.log("Editing Post... " + editingPost)
            return { editingPost: editingPost, editing: true };
        });
    }

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
        this.setState({ creating: false, selectedPost: null, editing: false });
    }
    
    render() {
        return (
            <React.Fragment>
                {this.state.hasError && <Redirect to="/404" />}
                {this.state.selectedPost &&
                    <Redirect to={`/posts/${this.state.selectedPost._id}`} />
                }
                {(this.state.editing && this.state.editingPost) &&
                    <Modal title={`Editing ${this.state.editingPost.title}`} canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalEditHandler}>
                        <PostForm submitHandler={this.submitHandler} titleEl={this.editTitleEl} descriptionEl={this.editDescriptionEl} imageEl={this.editImageEl} />
                    </Modal>
                }
                <div className="profile-container">
                    <div className="profile-detail p-5 row mx-0">
                        <div className="detail-left-side col-12 col-md-4 text-center">
                            <img src={`${this.state.userData.userProfileImg ? this.state.userData.userProfileImg : 'https://via.placeholder.com/350x320'}`} className="user-profile-image" width="150px" />
                            <p>{this.state.userData.username}</p>
                        </div>
                        <div className="detail-right-side col-12 col-md-8">
                            <p>About me:</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis nunc libero, a cursus felis tristique volutpat. Duis sit amet nunc libero. Nullam vehicula augue a felis tristique efficitur. In nunc ipsum, luctus et ipsum at, porttitor tempus ante. Maecenas at dictum tortor. Nunc lobortis ornare arcu, a tempus dolor molestie vitae. Vestibulum eget auctor risus. Curabitur porta suscipit arcu, sed scelerisque tellus fringilla eu.</p>
                        </div>
                    </div>
                    <div className="profile-posts">
                        {(this.state.isLoading)
                            ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                            : <section className="posts-list-container mt-5">
                                <PostsList onEditing={this.editingPostHandler} onDetail={this.showDetailHandler} posts={this.state.posts} userData={this.state.userData} authUserId={this.context.userId} authUserRol={this.context.userRol} />
                            </section>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default ProfilePage;