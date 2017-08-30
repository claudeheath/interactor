import React from 'react'
import ReactDOM from 'react-dom'
import './style.css';

import Wrapper from '../Wrapper'
import State from '../State'

const App = {}

App.update = function() {
  ReactDOM.render(<Wrapper state={State} />, document.getElementById('interactor-spa-root'))
}

export default App
