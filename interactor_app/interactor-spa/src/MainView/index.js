import React, { Component } from 'react'
import './style.css'

import GraphView from '../GraphView'

class MainView extends Component {
  handleAddNodeClick() {
    this.props.state.action('addNode')
  }

  handleAddLinkClick() {
    this.props.state.action('addLink')
  }

  handleAddGroupClick() {
    this.props.state.action('addGroup')
  }

  render() {
    return (
      <div className="ispa-main">
        <div className="ispa-menu">
          <div className="ispa-button" onClick={this.handleAddNodeClick.bind(this)}>Add item</div>
          <div className="ispa-button" onClick={this.handleAddLinkClick.bind(this)}>Add link</div>
          <div className="ispa-button" onClick={this.handleAddGroupClick.bind(this)}>Add group</div>
          <div className="ispa-message">{this.props.state.message}</div>
        </div>
        <GraphView state={this.props.state} width={this.props.width} height={this.props.height} />
      </div>
    );
  }
}

export default MainView
