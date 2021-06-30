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
// TODO: Enable persistence of state between user sessions by integrating storage
//       layer.
//----------------------------------------------------------------------------------

function Controller(bodyDivId) {
  this.cache = new LocalStorage()

  this.cities = new ModelCities()

  let numCities = this.cities.getNumCities()
  this.settings = new ModelSettings(numCities)

  this.priorities = new ModelPriorities(
    this.cities.getMidAffordabilityValue(),
    this.cities.getMidHappinessValue(),
    this.cities.getMidPoliticsValue(),
    {min: this.cities.getMinAffordabilityValue(),
     max: this.cities.getMaxAffordabilityValue()},
    {min: this.cities.getMinHappinessValue(),
     max: this.cities.getMaxHappinessValue()},
    {min: this.cities.getMinPoliticsValue(),
     max: this.cities.getMaxPoliticsValue()}
  )

  this.view = new View(
    bodyDivId,
    this.getMenuDrawerEventListeners().bind(this),
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
    this.cities.githubUrl,
    this.cache.hasSettings.bind(this.cache),
    this.settings.getMaxResults.bind(this.settings),
    this.settings.getMaxResultsOptions.bind(this.settings),
    this.settings.getLangCode.bind(this.settings),
    this.settings.getLangName.bind(this.settings),
    this.settings.getLangOptionsMap.bind(this.settings),
    this.settings.getCountryCode.bind(this.settings),
    this.settings.getCountryName.bind(this.settings),
    this.settings.getCountryOptionsMap.bind(this.settings),
    this.settings.getLocale.bind(this.settings),
    this.settings.getCurrency.bind(this.settings),
    this.priorities.getAffordabilityValue.bind(this.priorities),
    this.priorities.getHappinessValue.bind(this.priorities),
    this.priorities.getPoliticsValue.bind(this.priorities),
    this.priorities.getAffordabilityEnabled.bind(this.priorities),
    this.priorities.getHappinessEnabled.bind(this.priorities),
    this.priorities.getPoliticsEnabled.bind(this.priorities),
    this.priorities.getJobSearchEnabled.bind(this.priorities),
    this.priorities.getNormalizedPriorities.bind(this.priorities),
    this.priorities.hasNoPriorities.bind(this.priorities)
  )

  this.view.createLandingBody()
}

// https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on
Controller.prototype.delegate = function(el, evt, sel, handler) {
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

Controller.prototype.getMenuDrawerEventListeners = function() {
  return this.addMenuDrawerEventListeners
}

Controller.prototype.addMenuDrawerEventListeners = function() {
  var that = this
  this.delegate(document, "click", "#dismiss_menu_button", function(e) {
     let md = document.querySelector(".mdl-layout__drawer")
     if (md) {
       md.classList.remove("is-visible")
     }
     let modalObfuscator = document.querySelector(".mdl-layout__obfuscator")
     if (modalObfuscator) {
       modalObfuscator.classList.remove("is-visible")
     }
  })
  this.delegate(document, "click", "#view_values_button", function(e) {
    that.view.createPrioritiesBody()
  })
  this.delegate(document, "click", "#view_cities_button", function(e) {
    that.view.createResultsBody()
  })
  this.delegate(document, "click", "#settings_edit_button", function(e) {
    that.view.createSettingsBody()
  })
  this.delegate(document, "click", "#settings_restore_button", function(e) {
    that.cities.restoreDefaultSettings()
    that.view.setMaxResults()  // TODO: really should be something like that.view.setState()
                               //       Should rebuild modal-occluded page to reflect restored state.
                               //       Really need an update-view entrypoint that.view.update()
                               //       React is calling since it handles this kind of shizzle. (-:
    if (that.cache.hasSettingsCB()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.removeAttribute("disabled")
      }
    }
  })
  this.delegate(document, "click", "#settings_clearcache_button", function(e) {
    if (that.cache.clearSettings()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.setAttribute("disabled", "disabled")
      }
    }
  })
}

Controller.prototype.getNextButtonEventListener = function(createBodyFn) {
  let that = this
  function innerFunction() {
    createBodyFn()
  }
  return innerFunction
}
