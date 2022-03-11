export const bindStreamMetrics = (streammetricsOptions, videoElement, metricsHost) => {
  if(streammetricsOptions){
    try{
      let metricsDir
      const streammetrics     = new window['StreamMetrics']['default']("https://" + metricsHost + "/inbound/v1/event/register")
      const streammetricsApi  = streammetrics['wrap'](videoElement)
      let streamMetricsConfig = Object.assign({'api': streammetricsApi}, streammetricsOptions)
      streammetrics['start'](streamMetricsConfig)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('STREAMMETRICS NOT READY')
  }
}
