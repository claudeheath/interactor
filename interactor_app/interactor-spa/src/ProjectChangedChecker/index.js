/* This component checks whether a (shared) project has been saved by another user */

import * as d3 from 'd3'

import State from '../State'

function checkIfProjectSaveVersionHasChanged() {
  d3.json('/api/get-project-version/' + State.project.id + '/')
    .header("X-Requested-With", "XMLHttpRequest")
    .get(function(err, data) {
      const hasChanged = State.project.save_version !== data.save_version
      State.action('updateProjectSaveVersionHasChanged', hasChanged)
    })
}

const ProjectChangedChecker = {}

ProjectChangedChecker.startInterval = function(url) {
  window.setInterval(checkIfProjectSaveVersionHasChanged, 5000)
}

export default ProjectChangedChecker
