import React, { Component } from 'react';
// import './style.css';

// import SliderControl from '../SliderControl'

class GroupEditPanel extends Component {
  handleGroupNameChange(event) {
    this.props.state.action('setGroupName', event.target.value)
  }

  handleGroupDescriptionChange(event) {
    this.props.state.action('setGroupDescription', event.target.value)
  }

  // handleNodeSizeChange(newValue) {
  //   this.props.state.action('setNodeSize', newValue)
  // }
  //
  // handleNodeOpacityChange(newValue) {
  //   this.props.state.action('setNodeOpacity', newValue)
  // }

  handleDeleteGroupClick() {
    this.props.state.action('deleteGroup')
  }

  render() {
    return (
      <div className="ispa-sidebar-form">
        <div className="ispa-group-edit-panel">
            <div className="ispa-item">
              <div>What's the name of this group?</div>
              <div><input type="text" value={this.props.state.selectedGroup.name} onChange={this.handleGroupNameChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>What's your group's description?</div>
              <div><textarea rows="10" cols="40" value={this.props.state.selectedGroup.description} onChange={this.handleGroupDescriptionChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div className="ispa-button" onClick={this.handleDeleteGroupClick.bind(this)}>Remove "{this.props.state.selectedGroup.name}" grouping</div>
            </div>
        </div>
      </div>
    );
  }
}

export default GroupEditPanel;
