import * as _ from 'lodash';
import * as d3 from 'd3';

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
  g.append('text')
}

function getBoundingBoxFromCircles(circles) {
  var extents = []
  _.each(circles, d => {
    extents.push({x: d.x, y: d.y - d.r})
    extents.push({x: d.x + d.r, y: d.y})
    extents.push({x: d.x, y: d.y + d.r})
    extents.push({x: d.x - d.r, y: d.y})
  })
  var boundingBox = {
    xMin: d3.min(extents, d => d.x),
    xMax: d3.max(extents, d => d.x),
    yMin: d3.min(extents, d => d.y),
    yMax: d3.max(extents, d => d.y),
  }
  // console.log(extents, boundingBox)
  return boundingBox
}

function updatingGroup(d, p) {
  const g = d3.select(this)
  var lu = p.state.nodeLU

  var circles = _.map(d.nodes, d => {
    return {
      x: lu[d].x,
      y: lu[d].y,
      r: lu[d].size
    }
  })
  // console.log(circles)
  var boundingBox = getBoundingBoxFromCircles(circles)

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
