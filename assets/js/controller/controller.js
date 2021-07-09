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

function Controller(bodyDivId, locale = "en-US") {
  this.cache = new LocalStorage()

  // Instantiate model.
  this.cities = new ModelCities()

  // Instantiate view models.
  this.menu = new ModelMenu(locale)
  this.landing = new ModelLanding(locale)
  this.settings = new ModelSettings(locale, this.cities.getNumCities())

  this.priorities = new ModelPriorities(
    locale,
    this.cities.getMidAffordabilityValue(), // 
    this.cities.getMidHappinessValue(),     // TODO: Init these 3 props from cache if avail.
    this.cities.getMidPoliticsValue(),      // 
    this.cities.getAffordabilityRange(),
    this.cities.getHappinessRange(),
    this.cities.getPoliticsRange()
  )
  this.results = new ModelResults(locale, this.cities.isValidCityList)

  // Instantiate view, passing in state getters from models.
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
    this.cache.hasSettings.bind(this.cache),
    this.settings.githubUrl,
    this.settings.getMaxResults.bind(this.settings),
    this.settings.getMaxResultsOptions.bind(this.settings),
    this.settings.getLocale.bind(this.settings),
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
    this.menu.getMenuSettings.bind(this.menu),
    this.menu.getMenuSettingsEdit.bind(this.menu),
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
    this.results.getListLabelPolitics.bind(this.results)
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

Controller.prototype.getNextButtonEventListener = function(createBodyFn) {
  let that = this
  function innerFunction() {
    createBodyFn()
  }
  return innerFunction
}
