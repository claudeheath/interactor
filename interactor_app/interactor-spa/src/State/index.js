import * as d3 from 'd3'
import * as _ from 'lodash'
import * as Cookies from "js-cookie"
import {v4 as uuidv4} from 'uuid'

import App from '../App'
import Graph from '../Graph'
import Screenshot from '../Screenshot'


const State = {
  project: null,
  selectedNode: null,
  selectedLink: null,
  selectedGroup: null,
  addingLink: false,
  addLinkSelectedFromNode: null,
  addingItemsToGroup: false,
  deleteProjectCheckWithUser: false,
  projectSaveVersionHasChanged: false,
  message: '',
  nodeLU: {},
  workspaceTranslate: {x: 0, y: 0},
  tooltip: {
    active: false,
    type: null,
    d: null,
    x: 0,
    y: 0
  }
}

function updateNodeLU() {
  if(!State.project)
    return

  State.nodeLU = {}
  _.each(State.project.representation.nodes, d => {
    State.nodeLU[d.id] = d
  })
  // console.log('nodeLU', State.nodeLU)
}

function setDefaults() {
  // Set undefined parameters to default values
  // (Project representations may change as app evolves (e.g. new parameters get added) so this safeguards against undefined values)
  _.each(State.project.representation.nodes, d => {
    if(d.thickness === undefined)
      d.thickness = 1
  })
}

State.action = function(type, param) {
  // console.log('action', type, param)
  // console.log('representation', State.project ? State.project.representation : '')

  // let updateList = ['all']
  const csrftoken = Cookies.get('csrftoken')

  switch(type) {
  /* Project */
  case 'setProjectData':
    State.project = param
    setDefaults()
    State.tooltip.active = false
    updateNodeLU()
    break

  case 'deselectAll':
    State.selectedLink = null
    State.selectedNode = null
    State.selectedGroup = null
    State.addingItemsToGroup = false
    State.addingLink = false
    State.addLinkSelectedFromNode = null
    State.message = ''
    break

  /* Project actions */
  case 'setProjectName':
    State.project.name = param
    State.message = ''
    break
  case 'setProjectDescription':
    State.project.description = param
    State.message = ''
    break
  case 'setProjectCollaborators':
    State.project.collaborators = param
    State.message = ''
    break
  case 'saveProject':
    if(State.project === null)
      break

    d3.json('/api/project/' + State.project.id + '/')
      .header("X-Requested-With", "XMLHttpRequest")
     // .header("Content-Type", "application/x-www-form-urlencoded")
     .header("Content-Type", "application/json")
     .header("X-CSRFToken", csrftoken)
     .post(JSON.stringify(State.project), function(err, ret) {
      //  console.log('POST request', err, ret)
       if(err !== null)
        State.action('projectSaveError')
       else
        State.action('projectSaveSuccess', {
          saveVersion: ret.save_version
        })
     })
    break
  case 'projectSaveError':
    State.message = 'Error saving project'
    break
  case 'projectSaveSuccess':
    State.project.save_version = param.saveVersion
    State.projectSaveVersionHasChanged = false
    State.message = 'Project saved'
    break
  case 'updateProjectSaveVersionHasChanged':
    State.projectSaveVersionHasChanged = param
    // console.log('hasChanged', State.projectSaveVersionHasChanged)
    break
  case 'deleteProject':
    State.deleteProjectCheckWithUser = true
    break
  case 'cancelDeleteProject':
    State.deleteProjectCheckWithUser = false
    break
  case 'saveScreenshot':
    Screenshot.save(param.element, State, 'interactor-diagram.png')
    break
  case 'saveJSON':
    const data =  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.project, null, 2))
    param.element.href = data
    param.element.download = 'interactor.json'
    break

  /* Node actions */
  case 'selectNode':
    State.selectedLink = null
    if(State.addingLink) {
      if(State.addLinkSelectedFromNode === null) {
        State.addLinkSelectedFromNode = param
        State.message = 'Click the second item'
        break
      } else {
        // const maxNodeId = d3.max(State.project.representation.links, d => d.id)
        // console.log('maxNodeId', maxNodeId)
        let newLink = Graph.addLink(State.project.representation, State.addLinkSelectedFromNode.id, param.id)
        State.message = newLink ? 'Link added between ' + State.addLinkSelectedFromNode.name + ' and ' + param.name : 'Link already exists'
        State.addingLink = false
        State.addLinkSelectedFromNode = null
        State.selectedLink = newLink
        break
      }
    } else if(State.addingItemsToGroup) {
      Graph.addItemToGroup(State.selectedGroup, param)
      break
    }
    State.message = ''
    State.selectedNode = param
    State.selectedGroup = null
    break
  case 'setNodePosition':
    param.node.x = param.position.x
    param.node.y = param.position.y
    State.tooltip.active = false
    State.message = ''
    break
  case 'setNodeName':
    State.selectedNode.name = param
    State.message = ''
    break
  case 'setNodeDescription':
    State.selectedNode.description = param
    State.message = ''
    break
  case 'setNodeSize':
    State.selectedNode.size = +param
    State.message = ''
    break
  case 'setNodeThickness':
    State.selectedNode.thickness = +param
    State.message = ''
    break
  case 'setNodeOpacity':
    State.selectedNode.opacity = +param
    State.message = ''
    break
  case 'addNode':
    const nodes = State.project.representation.nodes
    // const maxNodeId = d3.max(nodes, d => d.id)
    const newNode = {
      "id": uuidv4(),
      "name": 'New node',
      "description": 'New node description',
      "x": Math.random() * 800,
      "y": Math.random() * 800,
      "size": 20,
      "opacity": 100
    }
    nodes.push(newNode)
    updateNodeLU()
    State.selectedNode = newNode
    State.addingItemsToGroup = false
    State.selectedLink = null
    State.selectedGroup = null
    State.message = 'New item added'
    break
  case 'deleteNode':
    // console.log('deleting node', State.selectedNode)
    // console.log('num links', State.project.representation.links.length)
    State.project.representation.nodes = _.filter(State.project.representation.nodes, d => d.id !== State.selectedNode.id)
    State.project.representation.links = _.filter(State.project.representation.links, d => (d.source !== State.selectedNode.id) && (d.target !== State.selectedNode.id))
    // console.log('num links after', State.project.representation.links.length)
    updateNodeLU()
    break
  case 'uploadNodeImage':
    if(param === undefined) {
      State.message = 'Please choose an image to upload'
      break
    }

    // Check type is image
    var imageType = param.type
    if(imageType.split('/')[0] !== 'image') {
      State.message = 'Please only upload images!'
      break
    }

    // Check file size
    if(param.size > 1000000) {
      State.message = 'Please keep image size less than 1Mb'
      break
    }

    var fd = new window.FormData()
    fd.append("image", param)

    d3.json(`/api/uploadimage/${State.project.id}/${State.selectedNode.id}`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("X-CSRFToken", csrftoken)
      .post(fd, function(err, ret) {
         State.action('setNodeImageUrl', {
           node: State.selectedNode,  // I'm not sure how robust this is... what if the user clicks another node before this returns? A better way is for the API to return the node id and we update according to that
           url: ret.url
         })
      })

    break
  case 'deleteNodeImage':
    d3.json(`/api/deletenodeimage/${State.project.id}/${State.selectedNode.id}`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("X-CSRFToken", csrftoken)
      .post('', function(err, ret) {
         State.action('setNodeImageUrl', {
           node: State.selectedNode,  // I'm not sure how robust this is... what if the user clicks another node before this returns?
           url: null
         })
      })
    break

  case 'setNodeImageUrl':
     param.node.imageUrl = param.url
     break

  /* Link actions */
  case 'addLink':
    State.addLinkSelectedFromNode = null
    State.selectedNode = null
    State.selectedGroup = null
    State.addingLink = true
    State.addingItemsToGroup = false
    State.message = 'Click the first item'
    break
  case 'deleteLink':
    State.project.representation.links = _.filter(State.project.representation.links, d => d.id !== State.selectedLink.id)
    State.message = 'Link deleted'
    break
  case 'selectLink':
    State.message = ''
    // State.selectedLink = param
    State.selectedLink = Graph.getNextLink(State.project.representation.links, param, State.selectedLink)
    State.selectedNode = null
    State.selectedGroup = null
    break
  case 'setLinkName':
    State.selectedLink.name = param
    State.message = ''
    break
  case 'setLinkDescription':
    State.selectedLink.description = param
    State.message = ''
    break
  case 'setLinkWidth':
    State.selectedLink.width = +param
    State.message = ''
    break
  case 'setLinkOpacity':
    State.selectedLink.opacity = +param
    State.message = ''
    break
  case 'setLinkCurvature':
    State.selectedLink.curvature = +param
    State.message = ''
    break

  /* Group actions */
  case 'addGroup':
    State.addingItemsToGroup = true

    State.selectedGroup = Graph.addGroup(State.project.representation)

    State.selectedLink = null
    State.selectedNode = null

    State.message = 'Click items to add to group (click background to finish)'
    break
  case 'selectGroup':
    State.addingItemsToGroup = false
    State.selectedGroup = param
    State.selectedNode = null
    State.selectedLink = null
    break
  case 'setGroupName':
    State.selectedGroup.name = param
    State.message = ''
    break
  case 'setGroupDescription':
    State.selectedGroup.description = param
    State.message = ''
    break
  case 'deleteGroup':
    Graph.deleteGroup(State.project.representation, State.selectedGroup)
    break


  /* Workspace */
  case 'workspacePan':
    State.workspaceTranslate.x += param.dx
    State.workspaceTranslate.y += param.dy
    break

  /* Tooltip */
  case 'updateTooltip':
    State.tooltip.active = param.active
    State.tooltip.d = param.d
    State.tooltip.type = param.type
    State.tooltip.x = d3.event.x
    State.tooltip.y = d3.event.y
    // updateList = ['tooltip']
    break

  default:
    console.warn('State action', type, 'not recognised')
    break
  }

  // if(_.includes(updateList, 'all'))
  App.update()

  // if(_.includes(updateList, 'tooltip'))
    // GraphViewTooltip.update()
}

export default State
