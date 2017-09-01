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

function midpoint(p0, p1) {
  return {x: p0.x + (p1.x - p0.x) / 2, y: p0.y + (p1.y - p0.y) / 2}
}

function dir(p0, p1) {
  var l = distanceBetweenPoints(p0, p1);
  return {x: (p1.x - p0.x) / l, y: (p1.y - p0.y) / l}
}

function orthogonal(dir) {
  return {x: -dir.y, y: dir.x}
}

function quadraticMidpoint(p0, p1) {
  var k = 0.2;
  var l = distanceBetweenPoints(p0, p1)
  var d = dir(p0, p1)
  var orth = orthogonal(d)
  var mid = midpoint(p0, p1)
  var kl = l * k
  return {x: mid.x + kl * orth.x, y: mid.y + kl * orth.y}
}

function getMidpointOfPath(path) {
  var length = path.getTotalLength();
  var midpoint = path.getPointAtLength(length * 0.5);
  return midpoint;
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
  const mid = quadraticMidpoint(p0, p1)

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
      const rot = getRotationFromSource(d, lu[d.source], lu[d.target])
      const pos = getMidpointOfPath(g.select('.ispa-line').node())
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
