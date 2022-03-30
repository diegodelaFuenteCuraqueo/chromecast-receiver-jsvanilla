# SimpleChromecastReceiver - Chromecast Receiver

## Description

Wrapper for Google Chromecast Framework libraries. It organizes the functionalities that make possible to create a casting request from a browser (or any other device), as well as handling Chromecast events and UI.

## Usage

This simple website will be loaded by a Chromecast device in order to reproduce a specific media.

A sender application should indicate a `receiverApplicationId` asociated to a public URL where this static website is hosted.
A SimpleChromecastReceiver object will receive data from the sender application in order to initalize casting. It will automatically bind to the (unique) video element avaiable on the HTML file and attach Streammetrics to it.

## Example

```javascript
const chromecastPlayer = new SimpleChromecastReceiver()
chromecastPlayer.start()
```

## Methods

* `_init()` Binds all listeners.
* `start()` Starts context
* `_updateCastStatus()` Update current object state based on device activity. It also binds Streammetrics to the videoElement.
* `_bindListeners()` Handles and forwards videoElement events towards sender application.
* `bindButtons()` Organizes the UI (TODO)


