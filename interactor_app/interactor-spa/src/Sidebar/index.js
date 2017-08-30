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

  render() {
    const s = this.props.state

    return (
      <div className="ispa-sidebar">

        {s.selectedNode === null && s.selectedLink === null && s.selectedGroup === null ? <ProjectEditPanel state={s} /> : null}
        {s.selectedNode !== null ? <NodeEditPanel state={s} /> : null}
        {s.selectedLink !== null ? <LinkEditPanel state={s} /> : null}
        {s.selectedGroup !== null ? <GroupEditPanel state={s} /> : null}

        <div className="ispa-sidebar-form">
          <div className="ispa-item">
            <div className="ispa-button" onClick={this.handleSaveClick.bind(this)}>Save project</div>
          </div>

          <div className="ispa-item">
            <div><a href="/editor/dashboard">Dashboard</a></div>
          </div>

          <div className="ispa-item">
            <div><a href="/account/logout">Logout</a></div>
          </div>
        </div>

      </div>
    );
  }
}

export default Sidebar;
