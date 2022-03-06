import { bindStreamMetrics } from './utils/bindStreamMetrics.js'
import { messageToSenderBuilder } from './utils/messageToSender.js'

const NAMESPACE = 'urn:x-cast:com.example.cast.events'
const context = cast.framework.CastReceiverContext.getInstance()
const playerManager = context.getPlayerManager()

const castElement = document.getElementsByTagName('cast-media-player')[0]
const videoElement = castElement.shadowRoot.getElementById('castMediaElement')

const messageToSender = messageToSenderBuilder(NAMESPACE,context)

videoElement.addEventListener('pause',    (e)=> messageToSender({type:'pause', ...e}))
videoElement.addEventListener('play',     (e)=> messageToSender({type:'play', ...e}))
videoElement.addEventListener('stop',     (e)=> messageToSender({type:'stop', ...e}))
videoElement.addEventListener('waiting',  (e)=> messageToSender({type:'waiting', ...e}))
videoElement.addEventListener('seeking',  (e)=> messageToSender({type:'seeking', destinationTime:e.srcElement.currentTime, ...e}))
videoElement.addEventListener('seek',     (e)=> messageToSender({type:'seek', destinationTime:e.srcElement.currentTime, ...e}))
videoElement.addEventListener('timeupdate',(e)=> messageToSender({type:'timeupdate', currentTime: e.srcElement.currentTime, ...e}))
videoElement.addEventListener('volumechange',(e)=> messageToSender({type:'volumechange', volume: e.target.volume, muted:e.target.muted, ...e}))

let customData = {}


const updateCastStatus = (status) => {
  messageToSender(status)
  if(status.type==='REQUEST_LOAD') {
    customData = { ...status.requestData.media.customData }
    bindStreamMetrics(customData.streamMetricsOptions,videoElement )
  }
}

playerManager.addEventListener(window.cast.framework.events.category.CORE, updateCastStatus)
context.addCustomMessageListener(NAMESPACE, (customEvent) => { console.log(" * " + customEvent) })
context.start()

class SimpleChromecastReceiver {

  constructor(castMediaPlayerElement){
    this.castMediaPlayerElement = castMediaPlayerElement
  }

}