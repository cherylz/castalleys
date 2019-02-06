import React from 'react';
import { render } from 'react-dom';
//import Home from './components/Home';
//import Podcast from './components/Podcast';
import Search from './components/Search';
import './css/style.css';
import * as serviceWorker from './serviceWorker';

render(<Search />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
