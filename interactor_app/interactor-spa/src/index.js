// import * as _ from 'lodash'

import ProjectLoader from './ProjectLoader'

window.interactor = window.interactor || {}

window.interactor.spa = {
  load: function(param) {
    ProjectLoader.startInterval(param.projectUrl)
  }
}
