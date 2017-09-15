import * as d3 from 'd3';
import Helpers from '../Helpers'

const links = {}

function handleLinkClick(d, p) {
  d3.event.stopPropagation()
  p.state.action('selectLink', d)
}

function handleMouseMove(d, p) {
  p.state.action('updateTooltip', {
    d: d,
    active: true,
    type: 'link'
  })
}

function handleMouseLeave(d, p) {
  p.state.action('updateTooltip', {
    active: false
  })
}

function arrowhead(d) {
  let size = d.width ? d.width : 1
  if(size < 6) size = 6
  return `M${-size},${-size} L0,0 L${size},${-size}`
}

function enteringLink(p) {
  const g = d3.select(this)
    .classed('ispa-link', true)
    .on('click', d => handleLinkClick(d, p))
    .on('mousemove', d => handleMouseMove(d, p))
    .on('mouseleave', d => handleMouseLeave(d, p))

  g.append('path')
    .classed('ispa-pick-layer', true)
    .style('fill', 'none')

  g.append('path')
    .classed('ispa-halo', true)
    .style('display', 'none')
    .style('stroke', '#aaa')
    .style('fill', 'none')

  g.append('path')
    .classed('ispa-arrowhead', true)
    .style('stroke', '#444')
    .style('stroke-width', '1')
    .style('fill', 'none')

  g.append('path')
    .classed('ispa-line', true)
    .style('fill', 'none')
    .style('stroke', '#444')
    // .style('stroke-width', '2')
}

function updatingLink(d, p) {
  const g = d3.select(this)
  var lu = p.state.nodeLU

  g.classed('ispa-active', d => {
      const s = p.state
      let thisIsSelected = (s.selectedLink !== null && s.selectedLink.id === d.id)
      return thisIsSelected
    })

  const p0 = {x: lu[d.source].x, y: lu[d.source].y};
  const p1 = {x: lu[d.target].x, y: lu[d.target].y};
  const k = d.curvature === undefined ? 0.2 : d.curvature
  const mid = Helpers.quadraticMidpoint(p0, p1, k)

  // Update the curve itself
  g.select('.ispa-line')
    .attr('d', 'M' + p0.x + ',' + p0.y + 'Q' + mid.x + ',' + mid.y + ' ' + p1.x + ',' + p1.y)
    .style('stroke-width', d.width)
    .style('stroke-dasharray', d => {
        let width = 1
        const gap = (100 - d.opacity) / 5
        return width + ' ' + gap
    })

  g.select('.ispa-pick-layer')
    .attr('d', 'M' + p0.x + ',' + p0.y + 'Q' + mid.x + ',' + mid.y + ' ' + p1.x + ',' + p1.y)

  g.select('.ispa-arrowhead')
    .attr('transform', () => {
      const rot = Helpers.getRotationFromSource(d, p0, p1)
      // const pos = Helpers.getMidpointOfPath(g.select('.ispa-line').node())
      const pos = Helpers.getQuadraticMidpoint(p0, p1, k)
      return `translate(${pos.x}, ${pos.y})rotate(${rot})`
    })
    .attr('d', d => arrowhead(d))

  g.select('.ispa-halo')
    .attr('d', 'M' + p0.x + ',' + p0.y + 'Q' + mid.x + ',' + mid.y + ' ' + p1.x + ',' + p1.y)
    .style('stroke-width', d.width + 8)
}

links.update = function(p) {
  var u = d3.select(p.el)
    .select('.ispa-links')
    .selectAll('.ispa-link')
    .data(p.data, d => d.id)

  u.enter()
    .append('g')
    .each(function() {
      enteringLink.call(this, p)
    })
    .merge(u)
    .sort(function(a, b) {
      return b.width - a.width
    })
    .each(function(d) {
      updatingLink.call(this, d, p)
    })

  u.exit().remove()
}

export default links
