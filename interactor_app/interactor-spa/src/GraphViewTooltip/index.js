import React, { Component } from 'react'
import * as d3 from 'd3';

import './style.css'

class GraphViewTooltip extends Component {
  render() {
    // console.log('update tooltip', this.props.state.tooltip)

    const t = this.props.state.tooltip
    const style = {
      display: t.active ? 'block' : 'none'
    }

    if(t.active) {
      // style.top = t.d.y + 'px'
      // style.left = t.d.x + 'px'
      style.top = d3.event.y + 'px'
      style.left = d3.event.x + 'px'
    }

    const name = t.active ? t.d.name : ''
    const description = t.active ? t.d.description : ''

    var fields
    switch(t.type) {
    case 'node':
      fields = <div>
        <div className="ispa-item">{description}</div>
        {t.d.size ? <div className="ispa-item"><span className="ispa-key">Size: </span>{t.d.size.toFixed()}</div> : null}
        {t.d.opacity ? <div className="ispa-item"><span className="ispa-key">Strength: </span>{t.d.opacity.toFixed()}</div> : null}
      </div>
      break
    case 'link':
      fields = <div>
        <div className="ispa-item">{description}</div>
        {t.d.width ? <div className="ispa-item"><span className="ispa-key">Width: </span>{t.d.width.toFixed()}</div> : null}
        {t.d.opacity ? <div className="ispa-item"><span className="ispa-key">Strength: </span>{t.d.opacity.toFixed()}</div> : null}
      </div>
      break
    case 'group':
      fields = <div>
        <div className="ispa-item">{description}</div>
      </div>
      break
    default:
      break
    }

    return (
      <div className="ispa-graphview-tooltip" style={style}>
        <div className="ispa-title">{name}</div>
        {fields}
      </div>
    );
  }
}

export default GraphViewTooltip
