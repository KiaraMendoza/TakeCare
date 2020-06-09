import React from 'react';

import '../SCSS/modal.scss';

const modal = props => {
    return (
        <div className="modal-container">
            <header className="modal-header">
                <p>{props.title}</p>
            </header>
            <section className="modal-content">
                {props.children}
            </section>
            <section className="modal-actions d-flex justify-content-end py-2">
                {props.canCancel && <button className="btn btn-secondary" onClick={props.onCancel}>Cancel</button>}
                {props.canConfirm && <button className="btn btn-success" onClick={props.onConfirm}>Confirm</button>}
            </section>
        </div>
    );
};

export default modal;
