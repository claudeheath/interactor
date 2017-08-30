import * as d3 from 'd3'
// import * as _ from 'lodash'

import State from '../State'


const ProjectLoader = {}

function load() {
  d3.json(ProjectLoader.projectUrl)
    .header("X-Requested-With", "XMLHttpRequest")
    .get(function(err, data) {
      State.action('setProjectData', data)
    })
}

ProjectLoader.startInterval = function(url) {
  ProjectLoader.projectUrl = url

  // Disabled for now
  // window.setInterval(load, 2000)

  load()
}

export default ProjectLoader
