import React, { Component } from 'react'
import * as d3 from 'd3';

import './style.css'

class SliderControl extends Component {
  constructor(props) {
    super(props)

    this.dragMove = this.dragMove.bind(this)
    this.scale = d3.scaleLinear().range([0, 240]).clamp(true)

    this.drag = d3.drag()
      .on("drag", this.dragMove)
  }

  // DRAGGING
  dragMove(d) {
    const newValue = this.scale.invert(d3.event.x)
    this.props.callback(newValue)
  }

  update() {
    d3.select(this.d3element)
      .select('circle')
      .attr('cx', this.scale(this.props.value))
  }

  componentDidMount() {
    this.scale.domain([this.props.min, this.props.max])

    d3.select(this.d3element)
      .select('circle')
      .call(this.drag)

    this.update()
  }

  componentDidUpdate() {
    this.update()
  }


  render() {
    return (
      <div className="ispa-slider-control">
        <svg width="260px" height="12px" ref={e => this.d3element = e} >
          <g transform="translate(10, 6)">
            <line x2="240px" ></line>
            <circle r="6"></circle>
          </g>
        </svg>
      </div>
    );
  }
}

export default SliderControl
