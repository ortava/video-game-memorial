import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import setButtons from './nameplates';
import './main.css';    // ensure that our css file is included by webpack

setButtons();           // assign functions to our button elements

ReactDOM.render(<App />, document.getElementById('loading'));   // renders the target div for IntersectionObserver in the #loading div at the bottom of the webpage