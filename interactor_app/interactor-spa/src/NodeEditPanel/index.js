import React, { Component } from 'react';
import './style.css';

import SliderControl from '../SliderControl'

class NodeEditPanel extends Component {
  handleNodeNameChange(event) {
    this.props.state.action('setNodeName', event.target.value)
  }

  handleNodeDescriptionChange(event) {
    this.props.state.action('setNodeDescription', event.target.value)
  }

  handleNodeSizeChange(newValue) {
    this.props.state.action('setNodeSize', newValue)
  }

  handleNodeOpacityChange(newValue) {
    this.props.state.action('setNodeOpacity', newValue)
  }

  handleUploadImageClick(e) {
    // console.log(this.uploadInput.files)
    this.props.state.action('uploadNodeImage', this.uploadInput.files[0])
  }

  handleDeleteImageClick(e) {
    // console.log(this.uploadInput.files)
    this.props.state.action('deleteNodeImage')
  }

  handleDeleteNodeClick() {
    this.props.state.action('deleteNode')
  }

  render() {
    const hasImage = this.props.state.selectedNode.imageUrl !== undefined && this.props.state.selectedNode.imageUrl !== null
    return (
      <div className="ispa-sidebar-form">
        <div className="ispa-node-edit-panel">
            <div className="ispa-item">
              <div>What's the name of this item?</div>
              <div><input type="text" value={this.props.state.selectedNode.name} onChange={this.handleNodeNameChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>What's your item's description?</div>
              <div><textarea rows="10" cols="40" value={this.props.state.selectedNode.description} onChange={this.handleNodeDescriptionChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>
                <svg width="245px" height="12px"><circle cx="5" cy="6" r="2" style={{fill: 'none', stroke: '#333', strokeWidth: 1}}/></svg>
                <svg width="12px" height="12px"><circle cx="6" cy="6" r="5" style={{fill: 'none', stroke: '#333', strokeWidth: 1}}/></svg>
              </div>
              <SliderControl min="0" max="150" state={this.props.state} value={this.props.state.selectedNode.size} callback={this.handleNodeSizeChange.bind(this)} />
            </div>

            <div className="ispa-item">
              <div>
                <svg width="240px" height="10px"><line y1="5" x2="15" y2="5" style={{stroke: '#333', strokeWidth: 1, strokeDasharray: '2 2'}}/></svg>
                <svg width="15px" height="10px"><line y1="5" x2="15" y2="5" style={{stroke: '#333', strokeWidth: 1}}/></svg>
              </div>
              <SliderControl min="0" max="100" state={this.props.state} value={this.props.state.selectedNode.opacity} callback={this.handleNodeOpacityChange.bind(this)} />
            </div>

            <div className="ispa-item">
              <div className="ispa-image-upload">
                {hasImage ? null : <div><input id="fileupload" type="file" ref={node => this.uploadInput = node} /></div>}
                {hasImage ? null : <div className="ispa-button ispa-upload-button" onClick={this.handleUploadImageClick.bind(this)}>Upload image</div>}
                {hasImage ? <div className="ispa-button ispa-delete-image-button" onClick={this.handleDeleteImageClick.bind(this)}>Delete image</div> : null}
              </div>
            </div>

            <div className="ispa-item">
              <div className="ispa-button" onClick={this.handleDeleteNodeClick.bind(this)}>Delete item "{this.props.state.selectedNode.name}"</div>
            </div>
        </div>
      </div>
    );
  }
}

export default NodeEditPanel;
