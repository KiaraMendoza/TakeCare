import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PageNotFound = () => {
    return (
        <div className="page-not-found text-center">
            <h1>Error 404: Page not found</h1>
            <img src="./img/404-wolfdog.jpg" alt="cute dog" />
            <p className="mt-3">Please, go back before it's cuteness consumes you!</p>
            <a className="go-back-button" href="/posts"><i className="fas fa-arrow-circle-left mr-2"></i>To main page</a>
        </div>
    );
};