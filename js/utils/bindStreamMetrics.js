export const bindStreamMetrics = (streammetricsOptions, videoElement) => {
  if(streammetricsOptions){
    console.log('streammetricsOptions',streammetricsOptions != null)
    try{
      let metricsDir
      const streammetrics = new window['StreamMetrics']['default']("https://" + ((metricsDir = window['STREAM_METRICS_HOST']) != null ? metricsDir : 'metrics.mdstrm.com') + "/inbound/v1/event/register")
      console.log(streammetrics)
      const streammetricsApi = streammetrics['wrap'](videoElement)
      streammetrics['start']({'api':streammetricsApi, ...streammetricsOptions})
      console.log('INITcASTpLAYER',streammetrics)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('STREAMMETRICS NOT READY')
  }
}
