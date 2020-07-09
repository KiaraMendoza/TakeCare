//Imports from the node_modules
import React, { useState, useEffect, useContext } from 'react';
//Imports from the project
import AuthContext from '../context/auth-context';
import CategoriesAside from '../components/Asides/Categories';
import RacesAside from './Asides/Races';
import PostCrud from '../handlers/postCrud';
import { useFetchToBack } from '../helpers/fetchToBack';

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
                        race {
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

    const closeMenuHandler = () => {
        if (document.getElementById("left-aside").classList.contains('see-left-aside')) {
            
        }
    }

    const LeftMenuHandler = () => {
        document.getElementById("left-aside").classList.toggle('see-left-aside');
        document.getElementById("right-aside").classList.remove('see-right-aside');
    };

    const RightMenuHandler = () => {
        document.getElementById("right-aside").classList.toggle('see-right-aside');
        document.getElementById("left-aside").classList.remove('see-left-aside');
    };

    return (
        <React.Fragment>
            <div className="posts-container row mx-0 px-0 position-relative justify-content-center">
                <aside id="left-aside" className="categories-aside col-md-3 col-lg-2"><CategoriesAside /></aside>
                    <div className="post-page-content col-12 col-md-8 px-0">
                        <PostsPageContent posts={props.posts ? props.posts : false} data={props.data ? props.data : false } />
                    </div>
                <aside id="right-aside" className="races-aside col-xl-2 px-lg-0"><RacesAside /></aside>
                <div className="see-aside-buttons right-aside-button position-fixed"><i onClick={RightMenuHandler} className="fas fa-align-right"></i></div>
                <div className="see-aside-buttons left-aside-button position-fixed"><i onClick={LeftMenuHandler} className="fas fa-align-left"></i></div>
            </div>
        </React.Fragment>
    )
}

export default PostsPage;