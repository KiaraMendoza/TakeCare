//Imports from the node_modules
import React, { Component } from 'react';
//Imports from the project
import Modal from '../modal/modal';
import Overlay from './Overlay';
import AuthContext from '../context/auth-context';
import EventsList from '../components/Events/EventsList';
import '../SCSS/events.scss';

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            username
                            email
                        }
                    }
                }
            `
        }

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
            const resEventsData = resData.data.events;
            this.setState({ events: resEventsData})
            console.log(this.state.events);

        })
        .catch(err => {
            throw err;
        });
    }

    //Open the modal
    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalConfirmHandler = () => {
        //We get the event's data using React references on the inputs
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            console.log('Something bad!');
            return;
        }

        const event = { title, price, date, description };

        //For creating an event
        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", date: "${date}", price: ${price}} ) {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            username
                            email
                        }
                    }
                }
            `
        }

        //Using our AuthContext we can get the user's token
        const token = this.context.token;

        //We need to use our token when creating events
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
        })
        .catch(err => {
            throw err;
        });

        this.setState({ creating: false });
    }

    //Close the modal
    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    render() {

        return (
            <React.Fragment>
                <div className="events-control text-center">
                <h1>EventsPage</h1>
                {this.context.token && 
                    <button className="btn btn-primary" onClick={this.startCreateEventHandler}>Create an event</button>
                }
                </div>
                {this.state.creating &&
                    <Overlay />
                }
                {this.state.creating && 
                    <Modal title="Add a new Event" canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalConfirmHandler}>
                        <form className="event-form text-center" onSubmit={this.submitHandler}>
                            <div className="mt-4 d-flex flex-column mt-4">
                                <label htmlFor="title">Title</label>
                                <input className="form-control" type="text" id="title" ref={this.titleEl} />
                            </div>
                            <div className="d-flex flex-column mt-4">
                                <label htmlFor="price">Price</label>
                                <input className="form-control" type="number" id="price" ref={this.priceEl} />
                            </div>
                            <div className="d-flex flex-column mt-4">
                                <label htmlFor="date">Date</label>
                                <input className="form-control" type="datetime-local" id="date" ref={this.dateEl} />
                            </div>
                            <div className="mt-4 d-flex flex-column mt-4">
                                <label htmlFor="description">Description</label>
                                <textarea className="form-control" rows="4" id="description" ref={this.descriptionEl} />
                            </div>
                        </form>
                    </Modal>
                }
                <section className="events-list-container mt-5">
                    <EventsList events={this.state.events} authUserId={this.context.userId}/>
                </section>
            </React.Fragment>
        )
    }
}

export default EventsPage;