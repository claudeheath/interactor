import * as d3 from 'd3';

const nodes = {}

function handleClick(d, p) {
  d3.event.stopPropagation()
  p.state.action('selectNode', d)
}

function handleMouseMove(d, p) {
  p.state.action('updateTooltip', {
    d: d,
    active: true,
    type: 'node'
  })
}

function handleMouseLeave(d, p) {
  p.state.action('updateTooltip', {
    active: false
  })
}

function enteringNode(d, p) {
  const g = d3.select(this)
    .classed('ispa-node', true)
    .call(p.drag)
    .style('fill', 'white')
    .style('stroke', '#555')
    .style('stroke-width', 1)
    .on('click', d => handleClick(d, p))
    .on('mousemove', d => handleMouseMove(d, p))
    .on('mouseleave', d => handleMouseLeave(d, p))

  g.append('circle')
    .classed('ispa-halo', true)
    .style('display', 'none')

  g.append('circle')
    .classed('ispa-circle', true)

  g.append('defs')
    .append('clipPath')
    .attr('id', 'node-clip-' + d.id)
    .append('circle')

  g.append('svg:image')
    .classed('ispa-image', true)
    .attr('clip-path', `url(#node-clip-${d.id})`)

  g.append('text')
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', '#333')
    .style('stroke', 'none')
  }

function updatingNode(d, p) {
    const g = d3.select(this)
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .classed('ispa-active', d => {
        const s = p.state
        let thisIsSelected = s.selectedNode !== null && s.selectedNode.id === d.id
        thisIsSelected = thisIsSelected || (s.addLinkSelectedFromNode !== null && s.addLinkSelectedFromNode.id === d.id)
        return thisIsSelected
      })

    g.select('.ispa-halo')
      .attr('r', () => {
        return d.size + (0.5 * d.thickness) + 5
      })

    g.select('.ispa-circle')
      .attr('r', d.size)
      .style('stroke-width', () => {
        return +d.thickness
      })
      .style('stroke-dasharray', () => {
        if(d.opacity === 100)
          return 'none'
        let width = (100 - d.opacity) / 5
        width = width > 5 ? 5 : width
        const gap = (100 - d.opacity) / 5
        return width + ' ' + gap
      })

    g.select('clipPath circle')
      .attr('r', d.size >= 4 ? d.size - (0.5 * d.thickness) - 4 : 0)

    if(d.imageUrl) {
      g.select('.ispa-image')
        .attr('xlink:href', d.imageUrl)
        .attr('x', -d.size)
        .attr('y', -d.size)
        .attr('width', d.size * 2)
        .attr('height', d.size * 2)
    } else {
      g.select('.ispa-image')
        .attr('xlink:href', null)
    }

    g.select('text')
      .attr('y', d.size + 16)
      .text(d.name)
  }

nodes.update = function(p) {
  const u = d3.select(p.el)
    .select('.ispa-nodes')
    .selectAll('.ispa-node')
    .data(p.data, d => d.id)

  u.enter()
    .append('g')
    .each(function(d) {
      enteringNode.call(this, d, p)
    })
    .merge(u)
    .sort(function(a, b) {
      return b.size - a.size
    })
    .each(function(d) {
      updatingNode.call(this, d, p)
    })

  u.exit().remove()
}

export default nodes
