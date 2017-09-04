import React, { Component } from 'react';
import './style.css';

import ProjectEditPanel from '../ProjectEditPanel'
import NodeEditPanel from '../NodeEditPanel'
import LinkEditPanel from '../LinkEditPanel'
import GroupEditPanel from '../GroupEditPanel'


class Sidebar extends Component {
  handleSaveClick() {
    this.props.state.action('saveProject')
  }

  handleScreenshotClick(e) {
    this.props.state.action('saveScreenshot', {element: e.target})
  }

  handleDeleteClick() {
    this.props.state.action('deleteProject')
  }

  handleCancelDeleteClick() {
    this.props.state.action('cancelDeleteProject')
  }

  render() {
    const s = this.props.state

    return (
      <div className="ispa-sidebar">

        <h2>InterActor (alpha)</h2>

        {s.selectedNode === null && s.selectedLink === null && s.selectedGroup === null ? <ProjectEditPanel state={s} /> : null}
        {s.selectedNode !== null ? <NodeEditPanel state={s} /> : null}
        {s.selectedLink !== null ? <LinkEditPanel state={s} /> : null}
        {s.selectedGroup !== null ? <GroupEditPanel state={s} /> : null}

        <div className="ispa-sidebar-form">
          <div className="ispa-item">
            <div className="ispa-button" onClick={this.handleSaveClick.bind(this)}>Save project</div>
            {this.props.state.projectSaveVersionHasChanged ? <div>Someone else has saved this project. You can continue to edit but if you save this project it will overwrite their changes. You can load the latest version by clicking your browser's refresh button.</div> : null}
          </div>

          <div className="ispa-item">
            <div className="ispa-button" onClick={this.handleScreenshotClick.bind(this)}><a>Download png image</a></div>
          </div>

          <div className="ispa-item">
            {this.props.state.deleteProjectCheckWithUser ? null : <div className="ispa-button" onClick={this.handleDeleteClick.bind(this)}>Delete project</div>}
            {this.props.state.deleteProjectCheckWithUser ? <div className="ispa-button" onClick={this.handleCancelDeleteClick.bind(this)}>Cancel delete project</div> : null}
            {this.props.state.deleteProjectCheckWithUser ? <div className="ispa-ok-to-delete"><a href={"/editor/delete-project/" + this.props.state.project.id}>Confirm delete project</a></div> : null}
          </div>

          <div className="ispa-item">
            <div><a href="/editor/dashboard">Back to Dashboard</a></div>
          </div>

          {/*}<div className="ispa-item">
            <div><a href="/account/logout">Logout</a></div>
          </div>*/}
        </div>

      </div>
    );
  }
}

export default Sidebar;
