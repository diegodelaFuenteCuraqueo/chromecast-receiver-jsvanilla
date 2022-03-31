export const bindStreamMetrics = ( streammetricsOptions, videoElement, metricsHost ) => {
  try{
    let metricsURL = metricsHost.includes('http') ? metricsHost : "https://" + metricsHost + "/inbound/v1/event/register"
    const streammetrics     = new window['StreamMetrics']['default']( metricsURL)
    const streammetricsApi  = streammetrics['wrap'](videoElement)
    let streamMetricsConfig = Object.assign({'api': streammetricsApi}, streammetricsOptions)
    streammetrics['start'](streamMetricsConfig)
  } catch (e) {
    console.error('Streammetrics error:', e)
  }
}
