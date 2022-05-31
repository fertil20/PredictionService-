import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
//import 'bootstrap/dist/css/bootstrap-grid.min.css';
import {BrowserRouter as Router} from 'react-router-dom';

const body = document.querySelector('body')

body.style.backgroundColor = 'rgb(240, 242, 245)'

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

