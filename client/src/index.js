// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App'; // Import the main component that holds all routes

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
