export const bindStreamMetrics = (streammetricsOptions, videoElement, metricsHost) => {
  if(streammetricsOptions){
    try{
      let metricsURL = metricsHost.includes('http') ? metricsHost : "https://" + metricHost + "/inbound/v1/event/register"
      const streammetrics     = new window['StreamMetrics']['default']( metricsURL)
      const streammetricsApi  = streammetrics['wrap'](videoElement)
      let streamMetricsConfig = Object.assign({'api': streammetricsApi}, streammetricsOptions)
      console.log('streammetricsOptions',streammetricsOptions)
      streammetrics['start'](streamMetricsConfig)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('STREAMMETRICS NOT READY')
  }
}
