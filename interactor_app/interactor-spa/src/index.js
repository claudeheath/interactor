// import * as _ from 'lodash'

import ProjectLoader from './ProjectLoader'
import ProjectChangedChecker from './ProjectChangedChecker'

window.interactor = window.interactor || {}

window.interactor.spa = {
  load: function(param) {
    ProjectLoader.startInterval(param.projectUrl)
    if(!param.dev)
      ProjectChangedChecker.startInterval()
  }
}
