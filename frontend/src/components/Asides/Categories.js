import React from 'react';
//Imports from the project
import '../../SCSS/posts.scss';

const categories = ['Husky', 'German shepard', 'Yorkshire', 'Chihuaha', 'Checoslovaquian WD'];

const CategoriesAside = props => {
    return (
        <div className="aside-content px-4 py-5 mt-5">
            <div className="categories-list">
                <div className="categories d-flex flex-column">
                    {categories.map(category => <p key={category}>{category}</p>)}
                </div>
            </div>
        </div>
    );
};

export default CategoriesAside;