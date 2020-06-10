//Imports from the node_modules
import React from 'react';
//Imports from the project
import '../../SCSS/events.scss';


//Dinamically render events by mapping the fetched-populated event's state.


const EventItem = props => {
    return (
        <div key={props._id} className="events-list-item my-5 p-4">
            <div className="list-header d-flex justify-content-between">
                <h3 className="list-title pr-3 mb-0">{props.title}</h3>
                <p className="list-price mb-0">{props.price}€</p>
            </div>
            <div className="list-content pt-5">
                <p className="list-description mb-0">{props.description}</p>
            </div>
            <div className="list-footer">
                <div className="row mx-0 justify-content-between">
                    <p className="list-date mt-5">{props.date}</p>
                    <p className="list-date mt-5">{props.creator}</p>
                </div>
                <div className="list-buttons d-flex justify-content-end position-relative">
                    <button className="list-see-comments btn btn-dark mt-4">Check the event</button>
                    {props.userId === props.creatorId && <button className="list-edit-button btn btn-secondary mt-4">Edit event</button>}
                </div>
            </div>
        </div>
    )
};

const eventsList = props => {
    const events = props.events.map(event => {
        return <EventItem key={event._id} userId={props.authUserId} creatorId={event.creator._id} title={event.title} price={event.price} date={event.date} description={event.description} creator={event.creator.username}/>
    })
    
    return (
        <div className="events-list">
            {events}
        </div>
    )
}

export default eventsList;