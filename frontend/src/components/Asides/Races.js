import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
//Imports from the project
import authContext from '../../context/auth-context';
import CategoriesContext from '../../context/categories-context';
import CategoryForm from '../Categories/CategoryForm';
import Modal from '../../modal/modal';

//const categories = ['Husky', 'German shepard', 'Yorkshire', 'Chihuaha', 'Checoslovaquian WD'];

const RacesAside = props => {
    //Get authContext
    const auth = useContext(authContext);
    const { races, setRaces } = useContext(CategoriesContext);
    //Declare state on a hook
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [racesList, setRacesList] = useState([]);
    //Adding React references to get the inputs' values.
    const nameEl = useRef(null);
    const iconEl = useRef(null);
    const descriptionEl = useRef(null);

    //Update categoriesContext when page's refresh or when added a new category.
    useEffect(() => {
        fetchRaces();
    }, []);

    //Method to fetch all categories:
    const fetchRaces = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                    races {
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
                                icon
                            }
                            race {
                                _id
                                name
                                icon
                            }
                        }
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = auth.token;

        //We need to use our token when creating posts
        fetch('https://takecare-socialapp.herokuapp.com:8000/graphql', {
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
                setIsLoading(false);
                setRacesList(resData.data.races);
                setRaces(resData.data.races);
                return racesList;
            })
            .catch(err => {
                setIsLoading(false);
                throw err;
            });

        return isLoading;
    }

    //Methods to CRUD:
    const startCreatingHandler = () => {
        setIsCreating(true)
        return isCreating;
    }

    const modalCancelHandler = () => {
        setIsCreating(false);
        return isCreating;
    }

    const createRace = () => {
        //We get the race's data using React references on the inputs
        const name = nameEl.current.value;
        const icon = iconEl.current.value;
        const description = descriptionEl.current.value;

        if (name.trim().length === 0 || description.trim().length === 0) {
            console.log('Something bad!');
            return;
        }

        //For creating a race
        const requestBody = {
            query: `
            mutation {
                createRace(raceInput: {name: "${name}", description: "${description}", icon: "${icon}" } ) {
                    _id
                    name
                    description
                    icon
                    posts {
                        _id
                        title
                        description
                        imageUrl
                    }
                }
            }
        `
        }

        //Using our AuthContext we can get the user's token
        const token = auth.token;

        //We need to use our token when creating posts
        fetch('https://takecare-socialapp.herokuapp.com:8000/graphql', {
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
                const createdRace = resData.data.createRace;
                setIsLoading(false);
                setIsCreating(false);
                setRacesList(prevState => {
                    return [...prevState, createdRace];
                });
                setRaces(prevState => {
                    return [...prevState, createdRace];
                });
                return createdRace;
            })
            .catch(err => {
                setIsLoading(false);
                throw err;
            });

        setIsCreating(false);
        return isCreating;
    }

    return (
        <React.Fragment>
            <CategoriesContext.Consumer>
                {(context) => {
                    return (
                        <div className="aside-content mt-5">
                            <div className="categories-list">
                                <div className="categories d-flex flex-column text-center">
                                    {(auth.token && auth.userRol === 'Admin') &&
                                        <button className="btn btn-primary mb-3" onClick={startCreatingHandler}>Add new breed</button>
                                    }
                                    {isCreating &&
                                        <Modal title="Adding new race..." canCancel onCancel={modalCancelHandler} canConfirm onConfirm={createRace}>
                                            <CategoryForm nameEl={nameEl} descriptionEl={descriptionEl} iconEl={iconEl} />
                                        </Modal>
                                    }
                                    <h3 className="aside-title">Breeds</h3>
                                    <hr />
                                    {racesList.map(race => <Link to={`/race/${race.name}`} key={race._id}><i className={`${race.icon} mr-2`} />{race.name}</Link>)}
                                </div>
                            </div>
                        </div>
                    )
                }}
            </CategoriesContext.Consumer>
        </React.Fragment>
    );
};

export default RacesAside;