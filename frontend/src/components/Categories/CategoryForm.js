//Imports from the node_modules
import React from 'react';
//Imports from the project

const CategoryForm = props => {

    const submitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <form className="posts-form text-center" onSubmit={submitHandler}>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="name">Name</label>
                <input className="form-control" type="text" id="name" ref={props.nameEl} />
            </div>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" rows="4" id="description" ref={props.descriptionEl} />
            </div>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="icon">Icon (fontAwesome classes)</label>
                <input className="form-control" type="text" id="icon" ref={props.iconEl} />
            </div>
        </form>
    );
};

export default CategoryForm;