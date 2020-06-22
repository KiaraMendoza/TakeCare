import React, {useState, useContext, useRef, useEffect } from 'react';
//Imports from the project
import '../../SCSS/posts.scss';
import authContext from '../../context/auth-context';
import CategoriesContext from '../../context/categories-context';
import CategoryForm from '../CategoryForm';
import Modal from '../../modal/modal';

//const categories = ['Husky', 'German shepard', 'Yorkshire', 'Chihuaha', 'Checoslovaquian WD'];

const CategoriesAside = props => {
    //Get authContext
    const auth = useContext(authContext);
    const { categories, setCategories } = useContext(CategoriesContext);
    //Declare state on a hook
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    //Adding React references to get the inputs' values.
    const nameEl = useRef(null);
    const iconEl = useRef(null);
    const descriptionEl = useRef(null);

    //Update categoriesContext when page's refresh or when added a new category.
    useEffect(() => {
        fetchCategories();
    }, []);

    //Method to fetch all categories:
    const fetchCategories = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                    categories {
                        _id
                        name
                        description
                        icon
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = auth.token;

        //We need to use our token when creating posts
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
            //console.log(`categories: ${resData.data.categories}`);
            setIsLoading(false);
            setCategoriesList(resData.data.categories);
            setCategories(resData.data.categories);
            return categoriesList;
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

    const createCategory = () => {
        //We get the category's data using React references on the inputs
        const name = nameEl.current.value;
        const icon = iconEl.current.value;
        const description = descriptionEl.current.value;

        if (name.trim().length === 0 || description.trim().length === 0) {
            console.log('Something bad!');
            return;
        }

        //For creating a category
        const requestBody = {
            query: `
            mutation {
                createCategory(categoryInput: {name: "${name}", description: "${description}", icon: "${icon}" } ) {
                    _id
                    name
                    description
                    icon
                }
            }
        `
        }

        //Using our AuthContext we can get the user's token
        const token = auth.token;

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
            console.log(`ResData: ${resData.data}, categoryData?: ${JSON.stringify(resData.data)}`)
            const createdCategory = resData.data.createCategory;
            setIsLoading(false);
            setIsCreating(false);
            setCategoriesList(prevState => {
                return [...prevState, createdCategory];
            });
            setCategories(prevState => {
                return [...prevState, createdCategory];
            });
            return createdCategory;
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
                        <div className="aside-content px-4 py-5 mt-5">
                            <div className="categories-list">
                                <div className="categories d-flex flex-column">
                                    {(auth.token && auth.userRol === 'Admin') &&
                                        <button className="btn btn-primary" onClick={startCreatingHandler}>Add new category</button>
                                    }
                                    {isCreating &&
                                        <Modal title="Adding new category..." canCancel onCancel={modalCancelHandler} canConfirm onConfirm={createCategory}>
                                            <CategoryForm nameEl={nameEl} descriptionEl={descriptionEl} iconEl={iconEl} />
                                        </Modal>
                                    }
                                    <hr />
                                    {categoriesList.map(category => <p key={category._id}><i className={category.icon}/>{category.name}</p>)}
                                </div>
                            </div>
                        </div>
                    )
                }}
            </CategoriesContext.Consumer>
        </React.Fragment>
    );
};

export default CategoriesAside;