import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useFetchToBack } from '../../helpers/fetchToBack';
import PostsPage from '../Posts';

export const RaceSingle = (props) => {
    const [racesData, setRacesData] = useState({});

    let raceName = props.match.params.name;

    console.log(props.location.pathname, props.match.params.name)

    const requestBody = {
        query: `
                query {
                    raceData(name : "${raceName}") {
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
                            race {
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

    const [isLoading, fetchedData] = useFetchToBack(requestBody, raceName);

    useEffect(() => {
        const raceName = props.match.params.name;
    }, [props.location.pathname]);

    useEffect(() => {
        setRacesData(fetchedData.raceData);
    }, [fetchedData]);

    return (
        <React.Fragment>
            <div className="post-category-container row mx-0">
                <div className="go-to-post-page d-none d-md-flex col col-md-2">
                    <Link className="go-back-button" to="/posts"><i className="fas fa-arrow-circle-left mr-2"></i>To main page</Link>
                </div>
            </div>
            <PostsPage posts={racesData ? racesData.posts : false} title={racesData ? racesData.name : ''} description={racesData ? racesData.description : ''} />
        </React.Fragment>
    )
}