import { bindStreamMetrics }      from '../utils/bindStreamMetrics.js'
import { messageToSenderBuilder } from '../utils/messageToSender.js'

const NAMESPACE = 'urn:x-cast:com.example.cast.events'

export default class SimpleChromecastReceiver {
  constructor(){
    this.context          = cast.framework.CastReceiverContext.getInstance()
    this.playerManager    = this.context.getPlayerManager() 
    this.messageToSender  = messageToSenderBuilder(NAMESPACE, this.context)
    try{
      this.castMediaPlayerElement = document.getElementsByTagName('cast-media-player')[0]
      this.videoElement           = this.castMediaPlayerElement.shadowRoot.getElementById('castMediaElement') 
    } catch (e) {
      console.error('Element not found', e)
    }
    this.customData = {}
    this._init()
  }

  _init(){
    this._bindListeners()
    this.playerManager.addEventListener(
      window.cast.framework.events.category.CORE, 
      this._updateCastStatus
    )
    this.context.addCustomMessageListener(
      NAMESPACE, 
      (customEvent) => { console.log(" * " + customEvent) }
    )
  }
  
  start(){
    this.context.start()
  }

  _updateCastStatus = (status) => {
    this.messageToSender(status)
    if(status.type === 'REQUEST_LOAD') {
      this.customData = { ...status.requestData.media.customData }
      bindStreamMetrics(this.customData.streamMetricsOptions, this.videoElement )
    }
  }

  _bindListeners(){
    this.videoElement.addEventListener('pause',       (e) => this.messageToSender({ type:'pause', ...e }))
    this.videoElement.addEventListener('play',        (e) => this.messageToSender({ type:'play', ...e }))
    this.videoElement.addEventListener('stop',        (e) => this.messageToSender({ type:'stop', ...e }))
    this.videoElement.addEventListener('waiting',     (e) => this.messageToSender({ type:'waiting', ...e }))
    this.videoElement.addEventListener('seeking',     (e) => this.messageToSender({ type:'seeking', destinationTime:e.srcElement.currentTime, ...e }))
    this.videoElement.addEventListener('seek',        (e) => this.messageToSender({ type:'seek', destinationTime:e.srcElement.currentTime, ...e }))
    this.videoElement.addEventListener('timeupdate',  (e) => this.messageToSender({ type:'timeupdate', currentTime: e.srcElement.currentTime, ...e }))
    this.videoElement.addEventListener('volumechange',(e) => this.messageToSender({ type:'volumechange', volume: e.target.volume, muted:e.target.muted, ...e }))  
  }
}
