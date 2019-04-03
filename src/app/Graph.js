import React from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { TimeXScalarYGraph } from 'react-svg-graphs'

export default ({ siteData, dates, onHover }) => {
  const xValues = dates.map(date => {
    const match = /([0-9]{4})([0-9]{2})([0-9]{2})/.exec(date)
    const year = match[1]
    const month = match[2]
    const day = match[3]
    return new Date(`${year}-${month}-${day}`).getTime()
  })
  const yValues = dates.map(date => siteData[date].accumulatedNDVI / 1e6)
  const graphData = {
    x: { label: 't', values: xValues },
    y: [{ label: 'Acc. NDVI', values: yValues }]
  }
  return <ReactResizeDetector handleWidth>
    {(width, height) => <TimeXScalarYGraph
      data={graphData}
      width={width || 640}
      height={200}
      title='Kruger National Park Accumulated NDVI 1e6'
      periodLabel='7y'
      onHover={onHover}
    />}
  </ReactResizeDetector>
}
