import React, { Component } from 'react';
import './style.css';

class ProjectEditPanel extends Component {
  // constructor(props) {
  //   super(props)
  // }

  handleProjectNameChange(event) {
    this.props.state.action('setProjectName', event.target.value)
  }

  handleProjectDescriptionChange(event) {
    this.props.state.action('setProjectDescription', event.target.value)
  }

  handleProjectCollaboratorsChange(event) {
    this.props.state.action('setProjectCollaborators', event.target.value)
  }

  render() {
    const hasCollaborators = this.props.state.project.collaborators !== undefined
    return (
      <div className="ispa-sidebar-form">
        <div className="ispa-project-edit-panel">
            <div className="ispa-item">
              <div>What's the name of your project?</div>
              <div><input type="text" value={this.props.state.project.name} onChange={this.handleProjectNameChange.bind(this)} /></div>
            </div>

            <div className="ispa-item">
              <div>What's your project's description?</div>
              <div><textarea rows="10" cols="40" value={this.props.state.project.description} onChange={this.handleProjectDescriptionChange.bind(this)} /></div>
            </div>

            {hasCollaborators ?
              <div className="ispa-item">
                <div>Who can edit this project? (Enter email addresses separated by commas)</div>
                <div><textarea rows="10" cols="40" value={this.props.state.project.collaborators} onChange={this.handleProjectCollaboratorsChange.bind(this)} /></div>
                <div>Share this location:</div><div>{window.location.href}</div><div>with your collaborators</div>
              </div> :
              <div></div>
            }
        </div>
      </div>
    );
  }
}

export default ProjectEditPanel;
