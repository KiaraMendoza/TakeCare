//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import AuthContext from '../context/auth-context';
import CategoriesAside from '../components/Asides/Categories';
import InfoAside from '../components/Asides/Info';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
import PostCrud from '../handlers/postCrud';

class PostsPage extends Component {
    state = {
        posts: [],
        isLoading: false,
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                    posts {
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

    render() {

        return (
            <React.Fragment>
                <div className="posts-container row mx-0 position-relative justify-content-center">
                    <aside className="categories-aside d-none d-md-flex col-md-2"><CategoriesAside /></aside>
                    <div className="post-page-content col-12 col-md-10 col-xl-8 px-0">
                        {this.state.isLoading
                            ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                            : <PostCrud posts={this.state.posts} canCreatePost />
                        }
                    </div>
                    <aside className="info-aside d-none d-xl-flex col-xl-2 pl-0"><InfoAside /></aside>
                </div>
            </React.Fragment>
        )
    }
}

export default PostsPage;