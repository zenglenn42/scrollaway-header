//----------------------------------------------------------------------------------
// Controller Utilities
//
// This file provides controller-related utilities that are not specific to a
// single view.
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
// Reload the app on orientation change from portrait to landscape or vice versa.
// Otherwise, we get content clipping especially on mobile platforms like iOS.
//
// Seems to work okay on iOS and Android, though it leverages a deprecated,
// iOS-centric event.
//
// See: Professional JavaScript for Web Developers by Matt Frisbie (2020)
// TODO: Evaluate alternate implementation below.
//----------------------------------------------------------------------------------

Controller.prototype.ManageOrientationChange = function() {
  window.addEventListener("orientationchange", (e) => { 
    window.location.reload()
  })
}

//----------------------------------------------------------------------------------
// This solution has the virtue of being testable from my desktop dev environment
// across safari, firefox, and chrome when in responsive mode.
//
// See: https://dev.to/andreseduardop/comment/1ekje
// TODO: Evaluate this on actual iOS and Android devices. BrowserStack anyone? :-)
//----------------------------------------------------------------------------------
//
// Controller.prototype.orientationMediaQuery = window.matchMedia('(orientation: portrait)')
// Controller.prototype.ManageOrientationChange = function() {
//   // Mobile vs desktop check courtesy: https://dev.to/andreseduardop/comment/1ekje
//   // TODO: Would '(hover: none)' media query be better proxy?
//
//   let isMobileRegEx = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Kindle/i
//   if (isMobileRegEx.test(navigator.userAgent)) {
//     if (this.orientationMediaQuery) {
//       this.orientationMediaQuery.addEventListener(
//         'change',
//         (e) => {window.location.reload()}
//       )
//     }
//   }
// }

//----------------------------------------------------------------------------------
// Manage delegated event handlers with this singleton.
//
// Prevents duplicate listeners from being added to dynamically created
// DOM elements.  We need this in the absence of jQuery's $.on() method.
//
// Inspired by:
// Learning Javascript Design Patterns by Addy Osmani
// https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on
// https://www.jimmycuadra.com/posts/keeping-track-of-javascript-event-handlers
//
// TODO: Is there a more canonical way to do this in 2021? :-)
//----------------------------------------------------------------------------------

Controller.prototype.ManagedEventHandlers = (function() {
  var _singleton

  function createInstance() {
    let _registered = {}  // private key-value store for registered event handlers

    // Adding a polyfill for el.matches() for IE 9-11 & Android 2x-4x
    // Needed below by our delegated addEventListener method.

    if (!Element.prototype.matches) {

      // Courtesy:
      // https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on

      Element.prototype.matches =
        Element.prototype.matchesSelector       ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector    ||
        Element.prototype.msMatchesSelector     ||
        Element.prototype.oMatchesSelector      ||
        function(s) {
            let matches = (this.document || this.ownerDocument).querySelectorAll(s)
            let i = matches.length
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1
        }
    }

    return {
      isAlreadyAdded: function(evt, sel) {
        let key = `${evt}_${sel}`
        return _registered.hasOwnProperty(key)
      },

      track: function(evt, sel, handler) {
        let key = `${evt}_${sel}`
        if (!this.isAlreadyAdded(key)) {
          _registered[key] = []
          _registered[key].push(handler)
        }
      },

      // Add event handlers for dynamically created elements.
      // See: https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on

      addEventListener: function(el, evt, sel, handler, useCapture = false) {

        // Track requests for adding delegated event handlers to
        // dynamically-created DOM elements so we can avoid adding duplicates.
        //
        // Otherwise, the view code as written may register duplicate handlers
        // and we'll see performance steadily degrade as the DOM runs the same
        // event through all of them. :-|

        let alreadyAdded = this.isAlreadyAdded(evt, sel)

        if (!alreadyAdded) {
          this.track(evt, sel, handler)
          el.addEventListener(evt, function(event) {
            let t = event.target
            while (t && t !== this) {
              if (t.matches(sel)) {
                handler.call(t, event)
              }
              t = t.parentNode
            }
          }, useCapture)
        }
      }
    }
  }

  return {
    getSingleton: function() {
      if (!_singleton) {
        _singleton = createInstance()
      }
      return _singleton
    }
  }
})()

//----------------------------------------------------------------------------------
// Check if we have connectivity to internet resources.
//
// This defaults to a blocking request on an internet resource so don't
// abuse.  If you want periodic checks during runtime, consider wrappering
// in an interval in asynchronous mode.
//
// Inspired by:
// www.kirupa.com/html5/check_if_internet_connection_exists_in_javascript.htm
//
// See also:
// www.freecodecamp.org/news/how-to-check-internet-connection-status-with-javascript
//
// TODO: Consider adopting this more nuanced approach:
//       https://gist.github.com/gitdagray/f310be81be217750fc9d2b233e2ae70c#gistcomment-3819167
//       Modify to use 'HEAD' since I'm not a fan of downloading a 1pixel image file.
//
// TODO: Consider moving this to an assets/js/network directory
//----------------------------------------------------------------------------------

Controller.prototype.checkInternet = function(
          checkUrl = "",
          callback = this.setOnlineStatus,
          runAsynchronously = false) {

  let avoidCache = Math.round(Math.random() * 10000)
  let dfltUrl = `https://i.imgur.com/7ofBNix.png?rand=${avoidCache}`  // smiley image
  let rqstUrl = (checkUrl) ? checkUrl : dfltUrl

  let xhr = new XMLHttpRequest()

  let checkFileOnly = 'HEAD'
  let httpMethod = checkFileOnly
  let useCapture = false

  if (typeof callback === 'function') {
    xhr.addEventListener("readystatechange", handleResponse, useCapture)
    if (runAsynchronously) {
      xhr.timeout = 5000  // Cancel request if nothing back after 5 seconds.
    }

    // TODO: Fix It!
    //
    // My synchronous xhr.open is raising eyebrows (especially on firefox).
    // Synchronous XMLHttpRequest on the main thread is deprecated because of
    // its detrimental effects to the end user’s experience.
    // For more help http://xhr.spec.whatwg.org/

    xhr.open(httpMethod, rqstUrl, runAsynchronously)
    try {
      xhr.send()
    } catch(err) {

      // Typically we get here on network-related problems:
      //  * wifi down
      //  * ethernet cable unplugged

      callback(false)
    }
  } else {
    console.log(
      '[Info] Controller.hasInternet() was not passed a valid callback.',
      'Ignoring request.'
    )
  }

  // This callback actually is invoked several times per internet check
  // as the ready state advances from:
  //
  //    1 (connection loading)
  //    2 (response headers received)
  //    3 (some data received)
  //    4 (request complete)
  //
  // Typically I only see states 1, 2, and 4.

  function handleResponse(e) {
    let doneState = 4 // All expected data received over the connection.
    if (xhr.readyState === doneState) {
      let httpRqstSucceeded = 200
      let httpRqstRedirected = 300
      if (xhr.status >= httpRqstSucceeded && xhr.status < httpRqstRedirected) {
        callback(true)  // :-)
      } else {
        // Encountered a server-related issue.  We alias this to
        // offline status but it could belie an issue with the request.
        callback(false) // :-(  no internet
      }
    }
  }
}

Controller.prototype.setOnlineStatus = function(status) {
  if (typeof status === 'boolean') {
    this.isOnline = status
  } else {
    this.isOnline = 'unknown'
  }
}

Controller.prototype.getOnlineStatus = function() {
  let status = (typeof this.isOnline === 'boolean') ? this.isOnline : 'unknown'
  return status
}

