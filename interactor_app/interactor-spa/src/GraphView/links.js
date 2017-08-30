import * as d3 from 'd3';

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

function getRotationFromSource(d, source, target) {
  const x = target.x - source.x
  const y = target.y - source.y
  const a = Math.atan2(x, y) // yes these are deliberately reversed, as we want a clockwise rotation from the vertical...
  const rot = - 180 * a / Math.PI
  return rot
}

function distanceBetweenPoints(p0, p1) {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
}

function getArrowheadDistance(source, target) {
  const sourceTargetDistance = distanceBetweenPoints(source, target)
  const u = target.size / sourceTargetDistance
  const distanceToArrowhead = (1 - u) * sourceTargetDistance
  return distanceToArrowhead
}

function enteringLink(p) {
  const g = d3.select(this)
    .classed('ispa-link', true)
    .on('click', d => handleLinkClick(d, p))
    .on('mousemove', d => handleMouseMove(d, p))
    .on('mouseleave', d => handleMouseLeave(d, p))

  g.append('line')
    .classed('ispa-pick-layer', true)
  g.append('line')
    .classed('ispa-halo', true)
  g.append('path')
    .classed('ispa-arrowhead', true)
  g.append('line')
    .classed('ispa-line', true)
}

function updatingLink(d, p) {
  const g = d3.select(this)
  var lu = p.state.nodeLU

  g.classed('ispa-active', d => {
      const s = p.state
      let thisIsSelected = (s.selectedLink !== null && s.selectedLink.id === d.id)
      return thisIsSelected
    })

  g.selectAll('line')
    .attr('x1', lu[d.source].x)
    .attr('y1', lu[d.source].y)
    .attr('x2', lu[d.target].x)
    .attr('y2', lu[d.target].y)

  g.select('.ispa-arrowhead')
    .attr('transform', () => {
      const s = lu[d.source]
      const rot = getRotationFromSource(d, lu[d.source], lu[d.target])
      const arrowHeadDistance = getArrowheadDistance(lu[d.source], lu[d.target])
      return `translate(${s.x}, ${s.y})rotate(${rot})translate(0,${arrowHeadDistance})`
    })
    .attr('d', d => arrowhead(d))

  g.select('.ispa-halo')
    .style('stroke-width', d.width + 8)

  g.select('.ispa-line')
    .style('stroke-width', d.width)
    .style('stroke-dasharray', d => {
        let width = 1
        const gap = (100 - d.opacity) / 5
        return width + ' ' + gap
    })
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
