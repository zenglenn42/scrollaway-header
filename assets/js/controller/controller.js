//----------------------------------------------------------------------------------
// Controller
//
// This class instantiates the models and view associated with this simple,
// single-user, front-end web app.  All the code runs on the client after initial
// download from the server.  Persistence of state is intended to happen on the 
// client (see TODO's below).
//
// State is managed within model objects and read or written via getter and 
// setter methods.  The business logic of ranking cities based upon user priorities
// is embodied within the cities model.
//
// The view binds to model-state getters passed in through the view constructor,
// allowing it to read state and visually update the browser window accordingly.
//
// The controller binds to model-state setters through composition,
// allowing it to mutate state in response to user-input events such as mouse clicks 
// or touch-screen activity.
//----------------------------------------------------------------------------------
// TODO: Allow the view to subscribe to model-state changes.
//
//       Currently the controller shoulders responsibility for keeping the view
//       synchronized with the models.
//
// TODO: Enable persistence of priority state between user sessions by integrating
//       storage layer.
//----------------------------------------------------------------------------------

function Controller(bodyDivId, locale = "en-US") {
  this.cache = new LocalStorage()

  // Instantiate domain model.

  this.cities = new ModelCities()

  // Instantiate view models.

  this.settings = new ModelSettings(locale, this.cities.getNumCities())
  if (this.cache.hasSettings()) {
    // Update current settings state from cached settings.

    let persistedSettings = this.cache.getSettings()
    this.settings.set(persistedSettings)
  }
  let getSettingsLocale = this.settings.getLocale.bind(this.settings)

  this.landing = new ModelLanding(getSettingsLocale)
  this.menu = new ModelMenu(getSettingsLocale)

  this.priorities = new ModelPriorities(
    getSettingsLocale,
    this.cities.getMidAffordabilityValue(), // 
    this.cities.getMidHappinessValue(),     // TODO: Init these 3 props from cache if avail.
    this.cities.getMidPoliticsValue(),      // 
    this.cities.getAffordabilityRange(),
    this.cities.getHappinessRange(),
    this.cities.getPoliticsRange()
  )
  if (this.cache.hasPriorities()) {
    // Update current priorities state from cached settings.

    let persistedPriorities = this.cache.getPriorities()
    this.priorities.set(persistedPriorities)
  }

  this.results = new ModelResults(getSettingsLocale, this.cities.isValidCityList)

  this.FAB = new ModelFAB(getSettingsLocale)
  if (this.cache.hasFAB()) {
    // Update current fab state from cached settings.

    let persistedFAB = this.cache.getFAB()
    this.FAB.set(persistedFAB)
  }

  this.delegatedHandlers = this.ManagedEventHandlers.getSingleton()

  // Get network status at object creation-time.
  //
  // We may want to set this up on an interval, but for now, we just check at
  // a few significant junctures in the code-flow.

  this.isOnline = 'unknown'
  this.checkInternet("", this.setOnlineStatus.bind(this))

  // Instantiate view, passing in state getters from models.
  this.view = new View(
    bodyDivId,
    this.FAB,
    this.getMenuDrawerEventListeners().bind(this),
    this.getHeaderEventListeners().bind(this),
    this.getLandingPageEventListeners().bind(this),
    this.getPrioritiesPageEventListeners().bind(this),
    this.getResultsPageEventListeners().bind(this),
    this.getSettingsPageEventListeners().bind(this),
    this.cities.getCityRankCB().bind(this.cities),
    this.cities.getMinHappinessValue(),
    this.cities.getMaxHappinessValue(),
    this.cities.getMinAffordabilityValue(),
    this.cities.getMaxAffordabilityValue(),
    this.cities.getMinPoliticsValue(),
    this.cities.getMaxPoliticsValue(),
    this.cities.getSketchyQuartile.bind(this.cities),
    this.cache.hasSettings.bind(this.cache),
    this.cache.hasFAB.bind(this.cache),
    this.cache.hasPriorities.bind(this.cache),
    getSettingsLocale,
    this.settings.githubUrl,
    this.settings.getMaxResults.bind(this.settings),
    this.settings.getMaxResultsOptions.bind(this.settings),
    this.settings.getLangName.bind(this.settings),
    this.settings.getLangOptionsMap.bind(this.settings),
    this.settings.getCountryCode.bind(this.settings),
    this.settings.getCountryName.bind(this.settings),
    this.settings.getCountryOptionsMap.bind(this.settings),
    this.settings.getCurrency.bind(this.settings),
    this.settings.getTitle.bind(this.settings),
    this.settings.getSelectLang.bind(this.settings),
    this.settings.getUseLang.bind(this.settings),
    this.settings.getSelectCountry.bind(this.settings),
    this.settings.getShowCities.bind(this.settings),
    this.settings.getSelectQuantity.bind(this.settings),
    this.settings.getShowTopCitiesBegin.bind(this.settings),
    this.settings.getShowTopCitiesEnd.bind(this.settings),
    this.priorities.getAffordabilityValue.bind(this.priorities),
    this.priorities.getHappinessValue.bind(this.priorities),
    this.priorities.getPoliticsValue.bind(this.priorities),
    this.priorities.getAffordabilityEnabled.bind(this.priorities),
    this.priorities.getHappinessEnabled.bind(this.priorities),
    this.priorities.getPoliticsEnabled.bind(this.priorities),
    this.priorities.getJobSearchEnabled.bind(this.priorities),
    this.priorities.getNormalizedPriorities.bind(this.priorities),
    this.priorities.hasNoPriorities.bind(this.priorities),
    this.priorities.getTitle.bind(this.priorities),
    this.priorities.getHappinessTitle.bind(this.priorities),
    this.priorities.getHappinessTooltip.bind(this.priorities),
    this.priorities.getPoliticsTitle.bind(this.priorities),
    this.priorities.getPoliticsTooltip.bind(this.priorities),
    this.priorities.getAffordabilityTitle.bind(this.priorities),
    this.priorities.getAffordabilityTooltip.bind(this.priorities),
    this.priorities.getJobSearchTitle.bind(this.priorities),
    this.priorities.getJobSearchTooltip.bind(this.priorities),
    this.priorities.getJobSearchPlaceholder.bind(this.priorities),
    this.landing.getAppName.bind(this.landing),
    this.landing.getSlogan.bind(this.landing),
    this.landing.getBlurb.bind(this.landing),
    this.landing.getCopyrightDate.bind(this.landing),
    this.menu.getMenuTitle.bind(this.menu),
    this.menu.getMenuView.bind(this.menu),
    this.menu.getMenuViewIntro.bind(this.menu),
    this.menu.getMenuViewPriorities.bind(this.menu),
    this.menu.getMenuViewBestBets.bind(this.menu),
    this.menu.getMenuViewBlog.bind(this.menu),
    this.menu.getMenuPriorities.bind(this.menu),
    this.menu.getMenuPrioritiesEdit.bind(this.menu),
    this.menu.getMenuPrioritiesClear.bind(this.menu),
    this.menu.getMenuPrioritiesDefault.bind(this.menu),
    this.menu.getMenuPrioritiesHappiness.bind(this.menu),
    this.menu.getMenuPrioritiesPolitics.bind(this.menu),
    this.menu.getMenuPrioritiesCost.bind(this.menu),
    this.menu.getMenuSettings.bind(this.menu),
    this.menu.getMenuSettingsEdit.bind(this.menu),
    this.menu.getMenuSettingsClear.bind(this.menu),
    this.menu.getMenuSettingsDefault.bind(this.menu),
    this.menu.getMenuSettingsUseLang.bind(this.menu),
    this.menu.getMenuSettingsShowCities.bind(this.menu),
    this.menu.getMenuSettingsShowTop.bind(this.menu),
    this.menu.getMenuSettingsHelp.bind(this.menu),
    this.results.getActiveDataView.bind(this.results),
    this.results.getRankedList.bind(this.results),
    this.results.getResultsTitle.bind(this.results),
    this.results.getNoResults.bind(this.results),
    this.results.getNoResultsImg.bind(this.results),
    this.results.getNoResultsAdvice.bind(this.results),
    this.results.getNoMapView.bind(this.results),
    this.results.getMissingCityImg.bind(this.results),
    this.results.getMonetizeHere.bind(this.results),
    this.results.getMonetizeLearnMore.bind(this.results),
    this.results.getMonetizeImg.bind(this.results),
    this.results.getPhotoLabelHappiness.bind(this.results),
    this.results.getPhotoLabelAffordability.bind(this.results),
    this.results.getPhotoLabelPolitics.bind(this.results),
    this.results.getChartTitle.bind(this.results),
    this.results.getChartLabelCombined.bind(this.results),
    this.results.getChartLabelHappiness.bind(this.results),
    this.results.getChartLabelAffordability.bind(this.results),
    this.results.getChartLabelPolitics.bind(this.results),
    this.results.getListLabelHappiness.bind(this.results),
    this.results.getListLabelAffordability.bind(this.results),
    this.results.getListLabelPolitics.bind(this.results),
    this.checkInternet.bind(this),
    this.getOnlineStatus.bind(this)
  )

  this.view.render()
}

// Use this singleton object to manage delegating event handlers.
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

Controller.prototype.ManagedEventHandlers = (function() {
  var _singleton

  function createInstance() {
    let _registered = {}  // private key-value store for registered event handlers

    // Adding a polyfill for el.matches() for IE 9-11 & Android 2x-4x
    // Needed below by our delegated addEventListener method.
    //
    // Courtesy:
    // https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on

    if (!Element.prototype.matches) {
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

      addEventListener: function(el, evt, sel, handler) {

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
          })
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
