import * as _ from 'lodash'
import * as d3 from 'd3'
import Helpers from '../Helpers'

const Screenshot = {}

function getBounds(nodes) {
  var minX = d3.min(nodes, d => d.x - d.size)
  var minY = d3.min(nodes, d => d.y - d.size)
  var maxX = d3.max(nodes, d => d.x + d.size)
  var maxY = d3.max(nodes, d => d.y + d.size)
  var padding = 50
  return {minX: minX - padding, minY: minY - padding, maxX: maxX + padding, maxY: maxY + padding}
}

function drawBackground(context, bounds) {
  context.save()

  context.strokeStyle = 'white';
  context.fillStyle = 'white';

  context.beginPath()
  context.rect(-10, -10, bounds.maxX - bounds.minX + 20, bounds.maxY - bounds.minY + 20)
  context.fill()

  context.restore()
}

function arrowhead(context, d) {
  let size = d.width ? d.width : 1
  if(size < 6) size = 6

  context.beginPath()
  context.moveTo(-size, -size)
  context.lineTo(0, 0)
  context.lineTo(size, -size)
  context.stroke()
}

function drawGroups(context, groups, lu) {
  _.each(groups, d => {
    context.save()

    context.setLineDash([1, 1])
    context.strokeStyle = '#aaa'
    context.lineWidth = 1

    var circles = _.map(d.nodes, d => {
      return {
        x: lu[d].x,
        y: lu[d].y,
        r: lu[d].size
      }
    })
    var boundingBox = Helpers.getBoundingBoxFromCircles(circles)

    context.rect(boundingBox.xMin, boundingBox.yMin, boundingBox.xMax - boundingBox.xMin, boundingBox.yMax - boundingBox.yMin)

    context.stroke()

    context.font = "13px 'Roboto', sans-serif"
    context.fillStyle = '#aaa'
    context.fillText(d.name, boundingBox.xMin, boundingBox.yMin - 6)

    context.restore()
  })
}

function drawLinks(context, links, lu) {
  _.each(links, d => {
    context.save()

    const p0 = {x: lu[d.source].x, y: lu[d.source].y}
    const p1 = {x: lu[d.target].x, y: lu[d.target].y}
    const k = d.curvature === undefined ? 0.2 : d.curvature
    const mid = Helpers.quadraticMidpoint(p0, p1, k)

    let width = 1
    const gap = (100 - d.opacity) / 5
    context.setLineDash([width, gap])
    context.lineWidth = d.width

    context.beginPath()
    context.moveTo(p0.x, p0.y)
    context.quadraticCurveTo(mid.x, mid.y, p1.x, p1.y)
    context.stroke()

    context.restore()


    // Arrowhead
    context.save()
    const rot = Helpers.getRotationFromSource(d, p0, p1)
    const pos = Helpers.getQuadraticMidpoint(p0, p1, k)

    // const pos = Helpers.getMidpointOfPath(g.select('.ispa-line').node())
    context.translate(pos.x, pos.y)
    context.rotate(rot * Math.PI / 180)
    arrowhead(context, d)

    context.restore()
  })
}

function drawNodes(context, nodes) {
  // _.each(nodes, d => {
  //   context.save()
  //
  //   let width = (100 - d.opacity) / 5
  //   width = width > 5 ? 5 : width
  //   const gap = (100 - d.opacity) / 5
  //   context.setLineDash([width, gap])
  //
  //   context.lineWidth = d.width
  //   context.fillStyle = 'white'
  //
  //   context.beginPath()
  //   context.arc(d.x, d.y, d.size, 0, 2 * Math.PI)
  //   context.stroke()
  //   context.fill()
  //
  //   context.font = "14px 'Oswald', sans-serif"
  //   context.fillStyle = '#333'
  //   context.textAlign = "center"
  //   context.fillText(d.name, d.x, d.y + d.size + 16)
  //
  //   context.restore()
  // })


  d3.select('.ispa-graphview .ispa-nodes')
    .selectAll('.ispa-node')
    .each(function(d) {
      context.save()

      let width = (100 - d.opacity) / 5
      width = width > 5 ? 5 : width
      const gap = (100 - d.opacity) / 5
      context.setLineDash([width, gap])

      context.lineWidth = d.width
      context.fillStyle = 'white'

      context.beginPath()
      context.arc(d.x, d.y, d.size, 0, 2 * Math.PI)
      context.stroke()
      context.fill()

      context.font = "14px 'Oswald', sans-serif"
      context.fillStyle = '#333'
      context.textAlign = "center"
      context.fillText(d.name, d.x, d.y + d.size + 16)

      if(d.imageUrl) {
        context.beginPath()
        context.arc(d.x, d.y, d.size >= 4 ? d.size - 4 : 0, 0, 2 * Math.PI)
        context.clip()

        var img = d3.select(this).select('image').node()
        context.drawImage(img, d.x - d.size, d.y - d.size, d.size * 2, d.size * 2)
      }

      context.restore()
    })
}

Screenshot.save = function(link, state, filename) {
  const project = state.project
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const bounds = getBounds(project.representation.nodes)

  const scaleFactor = 2

  canvas.width = scaleFactor * (bounds.maxX - bounds.minX)
  canvas.height = scaleFactor * (bounds.maxY - bounds.minY)

  context.lineWidth = 1;
  context.strokeStyle = '#333';
  context.fillStyle = 'white';

  context.scale(scaleFactor, scaleFactor)
  drawBackground(context, bounds)
  context.translate(-bounds.minX, -bounds.minY)
  drawGroups(context, project.representation.groups, state.nodeLU)
  drawLinks(context, project.representation.links, state.nodeLU)
  drawNodes(context, project.representation.nodes)

  link.href = canvas.toDataURL('image/png');
  link.download = filename
}

export default Screenshot
