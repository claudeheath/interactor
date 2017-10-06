import * as _ from 'lodash';
import * as d3 from 'd3';

import Helpers from '../Helpers'

const groups = {}

function handleGroupClick(d, p) {
  d3.event.stopPropagation()
  p.state.action('selectGroup', d)
}

function handleMouseMove(d, p) {
  p.state.action('updateTooltip', {
    d: d,
    active: true,
    type: 'group'
  })
}

function handleMouseLeave(d, p) {
  p.state.action('updateTooltip', {
    active: false
  })
}

function enteringGroup(p) {
  const g = d3.select(this)
    .classed('ispa-group', true)
    .on('click', d => handleGroupClick(d, p))
    .on('mousemove', d => handleMouseMove(d, p))
    .on('mouseleave', d => handleMouseLeave(d, p))

  g.append('rect')
    .style('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-width', '1')
    .style('stroke-dasharray', '1 1')

  g.append('text')
    .style('font-family', '"Open Sans", sans-serif')
    .style('font-size', '13px')
    .style('stroke', 'none')
    .style('fill', '#aaa')
}

function updatingGroup(d, p) {
  const g = d3.select(this)
  var lu = p.state.nodeLU

  var circles = _.map(d.nodes, d => {
    return {
      x: lu[d].x,
      y: lu[d].y,
      r: lu[d].size,
      thickness: lu[d].thickness
    }
  })
  // console.log(circles)
  var boundingBox = Helpers.getBoundingBoxFromCircles(circles)

  g.select('rect')
    .attr('x', boundingBox.xMin)
    .attr('y', boundingBox.yMin)
    .attr('width', boundingBox.xMax - boundingBox.xMin)
    .attr('height', boundingBox.yMax - boundingBox.yMin)

  g.select('text')
    .attr('x', boundingBox.xMin)
    .attr('y', boundingBox.yMin - 6)
    .text(d.name)
}

groups.update = function(p) {
  if(!p.data)
    return

  const groupData = _.filter(p.data, d => d.nodes.length > 0)

  var u = d3.select(p.el)
    .select('.ispa-groups')
    .selectAll('.ispa-group')
    .data(groupData, d => d.id)

  u.enter()
    .append('g')
    .each(function() {
      enteringGroup.call(this, p)
    })
    .merge(u)
    .each(function(d) {
      updatingGroup.call(this, d, p)
    })

  u.exit().remove()
}

export default groups
