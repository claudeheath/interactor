import * as _ from 'lodash';
import * as d3 from 'd3';

const Helpers = {}

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

Helpers.getRotationFromSource = function(d, source, target) {
  const x = target.x - source.x
  const y = target.y - source.y
  const a = Math.atan2(x, y) // yes these are deliberately reversed, as we want a clockwise rotation from the vertical...
  const rot = - 180 * a / Math.PI
  return rot
}

Helpers.quadraticMidpoint = function(p0, p1, k) {
  var l = distanceBetweenPoints(p0, p1)
  var d = dir(p0, p1)
  var orth = orthogonal(d)
  var mid = midpoint(p0, p1)
  var kl = l * k
  return {x: mid.x + kl * orth.x, y: mid.y + kl * orth.y}
}

Helpers.getQuadraticMidpoint = function(p0, p1, k) {
  const t = 0.5
  const midpoint = Helpers.quadraticMidpoint(p0, p1, k)
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * midpoint.x + t * t * p1.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * midpoint.y + t * t * p1.y;
  return {x: x, y: y}
}

Helpers.getBoundingBoxFromCircles = function(circles) {
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

export default Helpers
