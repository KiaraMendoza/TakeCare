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

const PostsPage = () => {

    const [postsList, setPosts] = useState([]);
    
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

    const [isLoading, fetchedData] = useFetchToBack(requestBody);
    
    let PostsPageContent = () => {
        return (
            <React.Fragment>
                {(isLoading) 
                    ? <div className="text-center"><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                    : <PostCrud posts={postsList ? postsList : []} canCreatePost />
                }
            </React.Fragment>
        )
    }

    useEffect(() => {
        setPosts(fetchedData.posts);
        console.log(`fetched Posts: {JSON.stringify(fetchedData.posts)}, PostsPageContent: ${PostsPageContent}`)
    }, [fetchedData]);

    return (
        <React.Fragment>
            <div className="posts-container row mx-0 position-relative justify-content-center">
                <aside className="categories-aside d-none d-md-flex col-md-2"><CategoriesAside /></aside>
                    <div className="post-page-content col-12 col-md-10 col-xl-8 px-0">
                        <PostsPageContent/>
                    </div>
                <aside className="info-aside d-none d-xl-flex col-xl-2 pl-0"><InfoAside /></aside>
            </div>
        </React.Fragment>
    )
}

export default PostsPage;