'use strict'

import { bindStreamMetrics }      from '../utils/bindStreamMetrics.js'
import { messageToSenderBuilder } from '../utils/messageToSender.js'

const NAMESPACE = 'urn:x-cast:com.example.cast.events'

export default class SimpleChromecastReceiver {
  constructor(){
    this.context                = cast.framework.CastReceiverContext.getInstance()
    this.playerManager          = this.context.getPlayerManager() 
    this.messageToSender        = messageToSenderBuilder(NAMESPACE, this.context)
    // this.castMediaPlayerElement = 
    this.videoElement           = document.getElementsByTagName('cast-media-player')[0].shadowRoot.getElementById('castMediaElement') 
    this.controls               = cast.framework.ui.Controls.getInstance();
    this.playerData             = new cast.framework.ui.PlayerData();
    this.playerDataBinder       = new cast.framework.ui.PlayerDataBinder(this.playerData);
    this.customData             = {}

    this.bindButtons()
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
      customEvent => { console.log(" * " + customEvent) }
    )
  }
  
  start(){
    this.context.start({
      supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA 
    })
  }

  _updateCastStatus = (status) => {
    this.messageToSender(status)
    if(status.type === 'REQUEST_LOAD') {
      this.customData = { ...status.requestData.media.customData }
      bindStreamMetrics(this.customData.streamMetricsOptions, this.videoElement, this.customData.metricsHost)
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

  bindButtons(){
    this.playerDataBinder.addEventListener(
      cast.framework.ui.PlayerDataEventType.MEDIA_CHANGED,
      (e) => {
        if (!e.value) return
        this.controls.clearDefaultSlotAssignments()
        this.controls.assignButton(
          cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
          cast.framework.ui.ControlsButton.SEEK_BACKWARD_30
        )
        this.controls.assignButton(
          cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
          cast.framework.ui.ControlsButton.QUEUE_PREV
        )
        this.controls.assignButton(
          cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
          cast.framework.ui.ControlsButton.SEEK_FORWARD_15
        )
        this.controls.assignButton(
          cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
          cast.framework.ui.ControlsButton.QUEUE_NEXT
        )
      }
    )
  }
}
