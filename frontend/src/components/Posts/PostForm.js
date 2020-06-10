//Imports from the node_modules
import React from 'react';
//Imports from the project
import '../../SCSS/posts.scss';

const PostForm = props => {
    return (
        <form className="posts-form text-center" onSubmit={props.submitHandler}>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="title">Title</label>
                <input className="form-control" type="text" id="title" ref={props.titleEl} />
            </div>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" rows="4" id="description" ref={props.descriptionEl} />
            </div>
            <div className="mt-4 d-flex flex-column mt-4">
                <label htmlFor="imageUrl">Image url</label>
                <input className="form-control" type="text" id="image" ref={props.imageEl} />
            </div>
        </form>
    );
};

export default PostForm;