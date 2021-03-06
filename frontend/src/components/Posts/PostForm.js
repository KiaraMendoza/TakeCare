//Imports from the node_modules
import React, { useContext, useState, useEffect } from 'react';
//Imports from the project
import '../../SCSS/posts.scss';
import CategoriesContext from '../../context/categories-context';

const PostForm = props => {
    const { categories, races } = useContext(CategoriesContext);
    const [categoriesList, setCategoriesList] = useState([categories]);
    const [racesList, setRacesList] = useState([races]);
    //const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCategoriesList(categories);
        setRacesList(races);
        console.log(categoriesList, racesList);
    }, [categories, races])

    
    return (
        <React.Fragment>
            <CategoriesContext.Consumer>
                {(context) => {
                 return (
                     <form className="posts-form text-center" onSubmit={props.submitHandler}>
                         <div className="mt-4 d-flex flex-column mt-4">
                             <label htmlFor="title">Title</label>
                             <input className="form-control" type="text" id="title" ref={props.titleEl} maxLength="70" />
                         </div>
                         <div className="mt-4 d-flex flex-column mt-4">
                             <label htmlFor="category">Category</label>
                             <select className="form-control" ref={props.categoryEl}>
                                 {context.categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                             </select>
                         </div>
                         <div className="mt-4 d-flex flex-column mt-4">
                             <label htmlFor="race">Race</label>
                             <select className="form-control" ref={props.raceEl}>
                                 {context.races.map(race => <option key={race._id} value={race._id}>{race.name}</option>)}
                             </select>
                         </div>
                         <div className="mt-4 d-flex flex-column mt-4">
                             <label htmlFor="description">Description</label>
                             <textarea className="form-control" rows="4" id="description" ref={props.descriptionEl} maxLength="850" />
                         </div>
                         <div className="mt-4 d-flex flex-column mt-4">
                             <label htmlFor="imageUrl">Image url</label>
                             <input className="form-control" type="text" id="image" ref={props.imageEl} />
                         </div>
                     </form>
                 )
                }}
            </CategoriesContext.Consumer>
        </React.Fragment>
    );
};

export default PostForm;