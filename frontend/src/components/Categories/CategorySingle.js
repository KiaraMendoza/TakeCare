import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../SCSS/category.scss';
import { useFetchToBack } from '../../helpers/fetchToBack';
import PostsPage from '../Posts';


export const CategorySingle = (props) => {
    const [categoriesData, setCategoriesData] = useState({});

    let categoryName = props.match.params.name;

    console.log(props.location.pathname, props.match.params.name)

    const requestBody = {
        query: `
                query {
                    categoryData(name : "${categoryName}") {
                        _id
                        name
                        description
                        icon
                        posts {
                            _id
                            title
                            description
                            imageUrl
                            category {
                                _id
                                name
                                description
                                icon
                            }
                            creator {
                                _id
                                username
                                rol
                                imageUrl
                            }
                        }
                    }
                }
            `
    }

    const [isLoading, fetchedData] = useFetchToBack(requestBody, categoryName);

    useEffect(() => {
        const categoryName = props.match.params.name;
    }, [props.location.pathname]);

    useEffect(() => {
        setCategoriesData(fetchedData.categoryData);
    }, [fetchedData]);

    return (
        <React.Fragment>
            <div className="post-category-container row mx-0">
                <div className="go-to-post-page d-none d-md-flex col col-md-2">
                    <Link className="go-back-button" to="/posts"><i class="fas fa-arrow-circle-left mr-2"></i>To main page</Link>
                </div>
                {/* <div className="category-data text-center col-12 col-md-10 col-xl-8">
                    <h2>{categoriesData ? categoriesData.name : ''}</h2>
                    <p>{categoriesData ? categoriesData.description : ''}</p>
                </div> */}
            </div>
            <PostsPage posts={categoriesData ? categoriesData.posts : false} title={categoriesData ? categoriesData.name : ''} description={categoriesData ? categoriesData.description : ''} />
        </React.Fragment>
    )
}