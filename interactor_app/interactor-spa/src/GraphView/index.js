import React, { Component } from 'react'
import * as d3 from 'd3';

import nodes from './nodes.js'
import links from './links.js'
import groups from './groups.js'

import GraphViewTooltip from '../GraphViewTooltip'

import './style.css'

class GraphView extends Component {
  constructor(props) {
    super(props)

    this.d3graph = null

    this.nodeDragMove = this.nodeDragMove.bind(this)
    this.workspaceDragMove = this.workspaceDragMove.bind(this)
    this.update = this.update.bind(this)

    this.workspaceDrag = d3.drag()
      .on('drag', this.workspaceDragMove)

    this.nodeDrag = d3.drag()
      .on('drag', this.nodeDragMove)
  }

  // DRAGGING
  nodeDragMove(d) {
    this.props.state.action('setNodePosition', {
      node: d,
      position: {x: d3.event.x, y: d3.event.y}
    })
  }

  workspaceDragMove() {
    this.props.state.action('workspacePan', {
      dx: d3.event.dx,
      dy: d3.event.dy
    })
  }

  handleBackgroundClick() {
    this.props.state.action('deselectAll', null)
  }


  update() {
    nodes.update({
      el: this.d3graph,
      data: this.props.state.project.representation.nodes,
      drag: this.nodeDrag,
      state: this.props.state
    })
    links.update({
      el: this.d3graph,
      data: this.props.state.project.representation.links,
      state: this.props.state
    })
    groups.update({
      el: this.d3graph,
      data: this.props.state.project.representation.groups,
      state: this.props.state
    })
  }

  componentDidMount() {
    this.update()

    d3.select(this.d3graph).call(this.workspaceDrag)
  }

  componentDidUpdate() {
    this.update()
  }


  render() {
    const s = this.props.state

    return (
      <div className="ispa-graphview">
        <svg width={this.props.width + 'px'} height={this.props.height + 'px'} ref={node => this.d3graph = node} onClick={this.handleBackgroundClick.bind(this)} >
          <defs>
            <filter id="ispa-dropshadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur result="blurOut" in="SourceAlpha" stdDeviation="4" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <g className="ispa-graph-container" transform={`translate(${s.workspaceTranslate.x}, ${s.workspaceTranslate.y})`}>
            <g className="ispa-groups"></g>
            <g className="ispa-links"></g>
            <g className="ispa-nodes"></g>
          </g>
        </svg>
        <GraphViewTooltip state={s} />
      </div>
    );
  }
}

export default GraphView
