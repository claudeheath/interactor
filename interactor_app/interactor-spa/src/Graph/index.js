import * as _ from 'lodash'
import {v4 as uuidv4} from 'uuid'

const Graph = {}


// Links
// function linkExists(graph, source, target) {
//   let ret = false
//   _.each(graph.links, d => {
//     if((d.source === source && d.target === target) || (d.source === target && d.target === source))
//       ret = true
//   })
//   return ret
// }

Graph.addLink = function(graph, source, target) {
  // if(linkExists(graph, source, target))
  //   return null

  const newLink = {
    id: uuidv4(),
    source: source,
    target: target,
    name: 'New link',
    description: 'Link description',
    width: 2,
    opacity: 100
  }
  graph.links.push(newLink)
  return newLink
}

// Allows user to cycle through links
Graph.getNextLink = function(links, clickedLink, currentlySelectedLink) {
  const source = clickedLink.source
  const target = clickedLink.target

  // First get all links between the 2 nodes
  const matchingLinks = _.filter(links, d => {
    return (d.source === source && d.target === target) || (d.source === target && d.target === source)
  })
  // console.log(matchingLinks)

  if(currentlySelectedLink === null) {
    return clickedLink
  }

  let i = _.findIndex(matchingLinks, d => d.id === currentlySelectedLink.id)
  i = (i + 1) % matchingLinks.length
  return matchingLinks[i]
}


// Groups
Graph.addGroup = function(graph) {
  graph.groups = graph.groups ? graph.groups : []
  let newGroup = {
    id: uuidv4(),
    name: 'New group',
    description: 'Group description',
    nodes: []
  }
  graph.groups.push(newGroup)
  return newGroup
}

Graph.addItemToGroup = function(group, item) {
  group.nodes.push(item.id)
}

Graph.deleteGroup = function(graph, groupToDelete) {
  graph.groups = _.filter(graph.groups, d => d.id !== groupToDelete.id)
}

export default Graph
