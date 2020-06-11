//Imports from the node_modules
import React from 'react';
//Imports from the project
import '../../SCSS/posts.scss';


//Dinamically render posts by mapping the fetched-populated post's state.
const PostItem = props => {
    return (
        <div className={`col-12 my-5 p-4 ${props.className}`}>
            <div key={props._id} className="posts-list-item p-4">
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
                        <button onClick={props.onDetail.bind(this, props.postId)} className="list-see-project btn btn-dark mt-4">Check the post</button>
                        {(props.userId === props.creatorId || props.userRol === 'Admin') &&
                            <button className="list-edit-button btn btn-secondary mt-4">Edit post</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

const PostsList = props => {
        const posts = props.posts.map(post => {
            if (post.creator) {
                return <PostItem key={post._id} postId={post._id} onDetail={props.onDetail} userId={props.authUserId} userRol={props.authUserRol} creatorId={post.creator._id} title={post.title} description={post.description} creator={post.creator.username} createdAt={post.createdAt} image={post.imageUrl} />
            } else {
                return <PostItem className="col-md-6" key={post._id} postId={post._id} onDetail={props.onDetail} userId={props.authUserId} userRol={props.authUserRol} creatorId={props.userData._id} title={post.title} description={post.description} creator={props.userData.username} createdAt={post.createdAt} image={post.imageUrl} />
            }
        })
    
    return (
        <div className="posts-list row mx-auto justify-content-around">
            {posts}
        </div>
    )
}

export default PostsList;