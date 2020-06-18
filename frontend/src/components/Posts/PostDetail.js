//Imports from the node_modules
import React from 'react';
import { Link } from 'react-router-dom';
//Imports from the project
import '../../SCSS/posts.scss';

const PostDetail = props => {
    return (
        <div className="post-detail-container">
            {props.selectedPost.description}
            <img src={props.selectedPost.imgUrl}></img>
        </div>
    );
};

export default PostDetail;