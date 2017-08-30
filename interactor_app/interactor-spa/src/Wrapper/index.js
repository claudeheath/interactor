import React, { Component } from 'react';

import Sidebar from '../Sidebar'
import MainView from '../MainView'

import './style.css'

class Wrapper extends Component {
  render() {
    // If we want this to be responsive, store + calculate widths and heights as part of state
    var sideBarWidth = 300
    var mainViewWidth = window.innerWidth - sideBarWidth
    var mainViewHeight = window.innerHeight - 10

    if(!this.props.state.project) {
      return (
        <div className="ispa-app-wrapper">Sorry, either something's gone wrong, or you're authorised to open this project</div>
      )
    }

    return (
      <div className="ispa-app-wrapper">
        <Sidebar state={this.props.state} />
        <MainView state={this.props.state} width={mainViewWidth} height={mainViewHeight} />
      </div>
    );
  }
}

export default Wrapper;
