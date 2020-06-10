//Imports from the node_modules
import React from 'react';
//Imports from the project
import '../../SCSS/events.scss';


//Dinamically render posts by mapping the fetched-populated post's state.
const PostItem = props => {
    return (
        <div key={props._id} className="events-list-item my-5 p-4">
            <div className="list-header d-flex justify-content-between">
                <h3 className="list-title pr-3 mb-0">{props.title}</h3>
            </div>
            <div className="list-content pt-5">
                <p className="list-description mb-0">{props.description}</p>
                <p className="list-image mb-0">{props.imageUrl}</p>
            </div>
            <div className="list-footer">
                <div className="row mx-0 justify-content-between">
                    <p className="list-date mt-5">{props.createdAt}</p>
                    <p className="list-date mt-5">{props.creator}</p>
                </div>
                <div className="list-buttons d-flex justify-content-end position-relative">
                    <button className="list-see-comments btn btn-dark mt-4">Check the post</button>
                    {props.userId === props.creatorId && <button className="list-edit-button btn btn-secondary mt-4">Edit post</button>}
                </div>
            </div>
        </div>
    )
};

const PostsList = props => {
    const posts = props.posts.map(post => {
        return <PostItem key={post._id} userId={props.authUserId} creatorId={post.creator._id} title={post.title} description={post.description} creator={post.creator.username} createdAt={post.createdAt} image={post.imageUrl}/>
    })
    
    return (
        <div className="events-list">
            {posts}
        </div>
    )
}

export default PostsList;