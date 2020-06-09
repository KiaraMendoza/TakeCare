import React, { Component } from 'react';

import Modal from '../modal/modal';
import Overlay from '../components/overlay';
import '../SCSS/events.scss';

class EventsPage extends Component {
    state = {
        creating: false,
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalConfirmHandler = () => {

    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.creating &&
                    <Overlay />
                }
                {this.state.creating && 
                    <Modal title="Add a new Event" canCancel onCancel={this.modalCancelHandler} canConfirm onConfirm={this.modalConfirmHandler}>
                        <p>Modal Content</p>
                    </Modal>
                }
                <div className="events-control text-center">
                    <h1>EventsPage</h1>
                    <button className="btn btn-primary" onClick={this.startCreateEventHandler}>Create an event</button>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;