import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Next idea
// Particles are either in an attract or a repel state
// While attracting, they move towards nearest neighbor
// (or possiblly just adjust their velocity)
// While repelling, they move away
// At some threshold they swap states (different threshholds for near vs far)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
