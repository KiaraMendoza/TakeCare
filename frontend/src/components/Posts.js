//Imports from the node_modules
import React, { useState, useEffect, useContext } from 'react';
//Imports from the project
import AuthContext from '../context/auth-context';
import CategoriesAside from '../components/Asides/Categories';
import InfoAside from '../components/Asides/Info';
import '../SCSS/posts.scss';
import '../SCSS/loading-spinner.scss';
import PostCrud from '../handlers/postCrud';
import { useFetchToBack } from '../helpers/fetchToBack';
import { PromiseProvider } from 'mongoose';

const PostsPage = (props) => {

    const [postsList, setPosts] = useState([]);
    
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
                        category {
                            _id
                            name
                            icon
                        }
                    }
                }
            `
    }

    const [isLoading, fetchedData] = useFetchToBack(requestBody);
    
    let PostsPageContent = () => {
        return (
            <React.Fragment>
                {(isLoading) 
                    ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                    : <PostCrud posts={props.posts ? props.posts : postsList ? postsList : []} canCreatePost title={props.title} description={props.description}/>
                }
            </React.Fragment>
        )
    }

    useEffect(() => {
        setPosts(fetchedData.posts);
    }, [fetchedData]);

    return (
        <React.Fragment>
            <div className="posts-container row mx-0 position-relative justify-content-center">
                <aside className="categories-aside d-none d-md-flex col-md-2"><CategoriesAside /></aside>
                    <div className="post-page-content col-12 col-md-10 col-xl-8 px-0">
                        <PostsPageContent posts={props.posts ? props.posts : false} data={props.data ? props.data : false } />
                    </div>
                <aside className="info-aside d-none d-xl-flex col-xl-2 pl-0"><InfoAside /></aside>
            </div>
        </React.Fragment>
    )
}

export default PostsPage;