import React, { Component } from 'react';
import './style.css';

import SliderControl from '../SliderControl'

class LinkEditPanel extends Component {
  handleLinkNameChange(event) {
    this.props.state.action('setLinkName', event.target.value)
  }

  handleLinkDescriptionChange(event) {
    this.props.state.action('setLinkDescription', event.target.value)
  }

  handleLinkWidthChange(newValue) {
    this.props.state.action('setLinkWidth', newValue)
  }

  handleLinkOpacityChange(newValue) {
    this.props.state.action('setLinkOpacity', newValue)
  }

  handleDeleteLinkClick() {
    this.props.state.action('deleteLink')
  }

  render() {
    return (
      <div className="ispa-sidebar-form">
        <div className="ispa-link-edit-panel">
            <div className="ispa-item">
              <div>What's the name of this link?</div>
              <div><input type="text" value={this.props.state.selectedLink.name} onChange={this.handleLinkNameChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>What's your link's description?</div>
              <div><textarea rows="10" cols="40" value={this.props.state.selectedLink.description} onChange={this.handleLinkDescriptionChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>
                <svg width="245px" height="15px"><line x1="5" y1="0" x2="5" y2="15" style={{stroke: '#333', strokeWidth: 1}}/></svg>
                <svg width="10px" height="15px"><line x1="5" y1="0" x2="5" y2="15" style={{stroke: '#333', strokeWidth: 5}}/></svg>
              </div>
              <SliderControl min="1" max="60" state={this.props.state} value={this.props.state.selectedLink.width} callback={this.handleLinkWidthChange.bind(this)} />
            </div>

            <div className="ispa-item">
              <div>
                <svg width="240px" height="10px"><line y1="5" x2="15" y2="5" style={{stroke: '#333', strokeWidth: 1, strokeDasharray: '2 2'}}/></svg>
                <svg width="15px" height="10px"><line y1="5" x2="15" y2="5" style={{stroke: '#333', strokeWidth: 1}}/></svg>
              </div>
              <SliderControl min="0" max="100" state={this.props.state} value={this.props.state.selectedLink.opacity} callback={this.handleLinkOpacityChange.bind(this)} />
            </div>

            <div className="ispa-item">
              <div className="ispa-button" onClick={this.handleDeleteLinkClick.bind(this)}>Delete link "{this.props.state.selectedLink.name}"</div>
            </div>
        </div>
      </div>
    );
  }
}

export default LinkEditPanel;
