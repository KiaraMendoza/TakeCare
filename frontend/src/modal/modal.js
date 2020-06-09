//Imports from the node_modules
import React from 'react';
//Imports from the project
import '../SCSS/modal.scss';


//Custom modal dynamic component for creating things like events
const modal = props => {
    return (
        <div className="modal-container">
            <div>
                <header className="modal-header">
                    <p>{props.title}</p>
                </header>
                <section className="modal-content">
                    {props.children}
                </section>
                <section className="modal-actions d-flex justify-content-end py-2">
                    {props.canCancel && <button className="btn btn-secondary mr-3" onClick={props.onCancel}>Cancel</button>}
                    {props.canConfirm && <button className="btn btn-success mr-3" onClick={props.onConfirm}>Confirm</button>}
                </section>
            </div>
        </div>
    );
};

export default modal;
