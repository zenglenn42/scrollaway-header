//----------------------------------------------------------------------------------
// View
//
// This class renders the visual components associated with the application 
// based upon the state of various models.
//
// State is fetched through getter methods passed into the constructor.
//
// At the moment, view code is spread across several files in a rough attempt
// at component modularity.  However, at runtime, all the code is coalesced
// under the same View namespace.
//----------------------------------------------------------------------------------
// TODO: Consider splitting this code into separate component classes aggregated by
//       by the View.  
//
//       This aligns better with the notion of an MVC app consisting of many 
//       smaller-MVCs, enabling more resilience to change and scalability.
//
// TODO: Allow the view to subscribe to model-state changes.  
//
//       Currently the controller shoulders responsibility for keeping the view 
//       synchronized with the models.  Eventually the view will include render()
//       methods that can be registered with and invoked by the models in response
//       to state changes therein.
//----------------------------------------------------------------------------------

function View(
  bodyDivId,
  fabModel,
  addMenuDrawerEventListeners,
  addLandingPageEventListeners,
  addPrioritiesPageEventListeners,
  addResultsPageEventListeners,
  addSettingsPageEventListeners,
  cityRankModelCB,
  minHappinessValue,
  maxHappinessValue,
  minAffordabilityValue,
  maxAffordabilityValue,
  minPoliticsValue,
  maxPoliticsValue,
  getSketchyQuartile,
  hasPersistedSettings,
  hasPersistedFAB,
  hasPersistedPriorities,
  getLocale,
  githubUrl,
  getMaxResults,
  getMaxResultsOptions,
  getLangName,
  getLangOptionsMap,
  getCountryCode,
  getCountryName,
  getCountryOptionsMap,
  getCurrency,
  getSettingsTitle,
  getSelectLang,
  getUseLang,
  getSelectCountry,
  getShowCities,
  getSelectQuantity,
  getShowTopCitiesBegin,
  getShowTopCitiesEnd,
  getAffordabilityValue,
  getHappinessValue,
  getPoliticsValue,
  getAffordabilityEnabled,
  getHappinessEnabled,
  getPoliticsEnabled,
  getJobSearchEnabled,
  getNormalizedPriorities,
  hasNoPriorities,
  getPrioritiesTitle,
  getPrioritiesHappinessTitle,
  getPrioritiesHappinessTooltip,
  getPrioritiesPoliticsTitle,
  getPrioritiesPoliticsTooltip,
  getPrioritiesAffordabilityTitle,
  getPrioritiesAffordabilityTooltip,
  getPrioritiesJobSearchTitle,
  getPrioritiesJobSearchTooltip,
  getPrioritiesJobSearchPlaceholder,
  getAppName,
  getSlogan,
  getBlurb,
  getCopyrightDate,
  getMenuTitle,
  getMenuView,
  getMenuViewIntro,
  getMenuViewPriorities,
  getMenuViewBestBets,
  getMenuViewBlog,
  getMenuPriorities,
  getMenuPrioritiesEdit,
  getMenuPrioritiesClear,
  getMenuPrioritiesDefault,
  getMenuPrioritiesHappiness,
  getMenuPrioritiesPolitics,
  getMenuPrioritiesCost,
  getMenuSettings,
  getMenuSettingsEdit,
  getMenuSettingsClear,
  getMenuSettingsDefault,
  getMenuSettingsUseLang,
  getMenuSettingsShowCities,
  getMenuSettingsShowTop,
  getMenuSettingsHelp,
  getActiveDataView,
  getRankedList,
  getResultsTitle,
  getNoResults,
  getNoResultsImg,
  getNoResultsAdvice,
  getMonetizeHere,
  getMonetizeLearnMore,
  getMonetizeImg,
  getPhotoLabelHappiness,
  getPhotoLabelAffordability,
  getPhotoLabelPolitics,
  getChartTitle,
  getChartLabelCombined,
  getChartLabelHappiness,
  getChartLabelAffordability,
  getChartLabelPolitics,
  getListLabelHappiness,
  getListLabelAffordability,
  getListLabelPolitics
) {

  this.fabModel = fabModel

  // Bind to LocalPersistence interface.
  this.hasPersistedSettings = hasPersistedSettings
  this.hasPersistedFAB = hasPersistedFAB
  this.hasPersistedPriorities = hasPersistedPriorities

  // Bind to SettingsModel interface.
  this.getMaxResults = getMaxResults
  this.getMaxResultsOptions = getMaxResultsOptions
  this.getLocale = getLocale
  this.getLangName = getLangName
  this.getLangOptionsMap = getLangOptionsMap
  this.getCountryCode = getCountryCode
  this.getCountryName = getCountryName
  this.getCountryOptionsMap = getCountryOptionsMap
  this.getSettingsTitle = getSettingsTitle
  this.getSelectLang = getSelectLang
  this.getUseLang = getUseLang
  this.getSelectCountry = getSelectCountry
  this.getShowCities = getShowCities
  this.getSelectQuantity = getSelectQuantity
  this.getShowTopCitiesBegin = getShowTopCitiesBegin
  this.getShowTopCitiesEnd = getShowTopCitiesEnd

  // Bind to PriorityModel interface.
  this.getAffordabilityValue = getAffordabilityValue
  this.getHappinessValue = getHappinessValue
  this.getPoliticsValue = getPoliticsValue
  this.getAffordabilityEnabled = getAffordabilityEnabled
  this.getHappinessEnabled = getHappinessEnabled
  this.getPoliticsEnabled = getPoliticsEnabled
  this.getJobSearchEnabled = getJobSearchEnabled
  this.getNormalizedPriorities = getNormalizedPriorities
  this.hasNoPriorities = hasNoPriorities
  this.getPrioritiesTitle = getPrioritiesTitle
  this.getPrioritiesHappinessTitle = getPrioritiesHappinessTitle
  this.getPrioritiesHappinessTooltip = getPrioritiesHappinessTooltip
  this.getPrioritiesPoliticsTitle = getPrioritiesPoliticsTitle
  this.getPrioritiesPoliticsTooltip = getPrioritiesPoliticsTooltip
  this.getPrioritiesAffordabilityTitle = getPrioritiesAffordabilityTitle
  this.getPrioritiesAffordabilityTooltip = getPrioritiesAffordabilityTooltip
  this.getPrioritiesJobSearchTitle = getPrioritiesJobSearchTitle
  this.getPrioritiesJobSearchTooltip = getPrioritiesJobSearchTooltip
  this.getPrioritiesJobSearchPlaceholder = getPrioritiesJobSearchPlaceholder

  // Bind to LandingModel interface.
  this.getAppName = getAppName
  this.getSlogan = getSlogan
  this.getBlurb = getBlurb
  this.getCopyrightDate = getCopyrightDate

  // Bind to MenuModel interface.
  this.getMenuTitle = getMenuTitle
  this.getMenuView = getMenuView
  this.getMenuViewIntro = getMenuViewIntro
  this.getMenuViewPriorities = getMenuViewPriorities
  this.getMenuViewBestBets = getMenuViewBestBets
  this.getMenuViewBlog = getMenuViewBlog
  this.getMenuPriorities = getMenuPriorities
  this.getMenuPrioritiesEdit = getMenuPrioritiesEdit
  this.getMenuPrioritiesClear = getMenuPrioritiesClear
  this.getMenuPrioritiesDefault = getMenuPrioritiesDefault
  this.getMenuPrioritiesHappiness = getMenuPrioritiesHappiness
  this.getMenuPrioritiesPolitics = getMenuPrioritiesPolitics
  this.getMenuPrioritiesCost = getMenuPrioritiesCost
  this.getMenuSettings = getMenuSettings
  this.getMenuSettingsEdit = getMenuSettingsEdit
  this.getMenuSettingsClear = getMenuSettingsClear
  this.getMenuSettingsDefault = getMenuSettingsDefault
  this.getMenuSettingsUseLang = getMenuSettingsUseLang
  this.getMenuSettingsShowCities = getMenuSettingsShowCities
  this.getMenuSettingsShowTop = getMenuSettingsShowTop
  this.getMenuSettingsHelp = getMenuSettingsHelp

  // Bind to MenuResults model
  this.getActiveDataView = getActiveDataView
  this.getRankedList = getRankedList
  this.getResultsTitle = getResultsTitle
  this.getNoResults = getNoResults
  this.getNoResultsImg = getNoResultsImg
  this.getNoResultsAdvice = getNoResultsAdvice
  this.getMonetizeHere = getMonetizeHere
  this.getMonetizeLearnMore = getMonetizeLearnMore
  this.getMonetizeImg = getMonetizeImg
  this.getPhotoLabelHappiness = getPhotoLabelHappiness
  this.getPhotoLabelAffordability = getPhotoLabelAffordability
  this.getPhotoLabelPolitics = getPhotoLabelPolitics
  this.getChartTitle = getChartTitle
  this.getChartLabelCombined = getChartLabelCombined
  this.getChartLabelHappiness = getChartLabelHappiness
  this.getChartLabelAffordability = getChartLabelAffordability
  this.getChartLabelPolitics = getChartLabelPolitics
  this.getListLabelHappiness = getListLabelHappiness
  this.getListLabelAffordability = getListLabelAffordability
  this.getListLabelPolitics = getListLabelPolitics

  this.bodyDivId = bodyDivId
  this.rankedList = []
  this.addMenuDrawerEventListeners = addMenuDrawerEventListeners
  this.addLandingPageEventListeners = addLandingPageEventListeners
  this.addPrioritiesPageEventListeners = addPrioritiesPageEventListeners
  this.addResultsPageEventListeners = addResultsPageEventListeners
  this.addSettingsPageEventListeners = addSettingsPageEventListeners

  this.cityRankModelCB = cityRankModelCB
  this.minHappinessValue = minHappinessValue
  this.maxHappinessValue = maxHappinessValue
  this.minAffordabilityValue = minAffordabilityValue
  this.maxAffordabilityValue = maxAffordabilityValue
  this.getSketchyQuartile = getSketchyQuartile

  this.githubUrl = githubUrl

  let locale = getLocale()
  let currency = getCurrency(getCountryCode())

  // TODO: Make sensitive to locale and locale changes.
  //       For now, just hardcode for en-US number formatting and USD.
  //       Implication is we need a new formatter when changing
  //       locale or currency from the settings page.

  this.formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  })

  this.resultsMain = undefined
}

View.prototype.render = function() {
  let page = this.fabModel.getCurrPage()
  this.createPageBody(page)
}

View.prototype.createPageBody = function(page) {
  switch(page) {
    case "landing":
      this.createLandingBody()
      break
    case "settings":
      this.createSettingsBody()
      break
    case "priorities":
      this.createPrioritiesBody()
      break
    case "results":
      this.createResultsBody()
      break
    default:
      console.log("View.createPageBody().  Unrecognized page:", page, " ",
                  "Default to landing page")
      this.createLandingBody()
  }
}

// Pages associated with the application are constructed in real-time and anchored
// off a single parent <div> as the user navigates from page to page.
//
// The following primitive is for removing obsolete nodes and associated event 
// handlers between page transitions.
//
// Simply clearing innerHTML doesn't suffice since it doesn't remove event handlers.
// You may otherwise end up with nuisance/duplicate event handlers responding to the
// same event.

View.prototype.removeChildNodes = function(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

View.prototype.createHeader = function(title, rightNavIcon) {
  let h = document.createElement("header")
  h.classList += "mdl-layout__header"
  h.innerHTML = `
      <div class="mdl-layout__header-row">
      <div class="mdl-layout-spacer mdl-layout__header-left-spacer">&nbsp;</div>
      <span class="mdl-layout-title mdl-layout-title-nudged">${title}</span>
      <div class="mdl-layout-spacer">&nbsp;</div>
      <nav class="mdl-navigation">
          <button id="header-home-button" class="mdl-navigation__link mdl-button mdl-js-button mdl-button--icon">
            <i class='material-icons header-icons'>home</i>
          </button>
        <!--
          <a class="mdl-navigation__link" href="">
            <i id="header-search" class="material-icons">${rightNavIcon}</i>
          </a>
          <a id="header-logo__link" class="mdl-navigation__link mdl-button mdl-js-button mdl-button--icon" href="" title="home" ref="noreferrer noopener">
            <i class='material-icons header-icons'>home</i>
          </a>
        -->
      </nav>
    `
  return h
}

View.prototype.addHeader = function(bodyDiv, header, menuDrawer, hamburgerMenu) {
  bodyDiv.appendChild(header)
  bodyDiv.appendChild(menuDrawer)
  bodyDiv.appendChild(hamburgerMenu)
}

// Some view models maintain ascii icons (since models are inherently more abstract).
// This routine allows the view to map those to an actual icon.
//
// Most of the actual icons are pulled from Google's Material Icons.
// See: https://fonts.google.com/icons

View.prototype.getIconFromAsciiIcon = function(asciiIcon) {
  let bugIcon = "pest_control" // Flag unknown asciiIcons with a bug icon.
  let realIcon = bugIcon

  switch(asciiIcon) {
    // Used by floating action button (FAB).
    case "<":
      realIcon = "navigate_before"
      break;
    case ">":
      realIcon = "navigate_next"
      break;
    case "city":
      realIcon = "location_city"
      break;
    case "sliders":
      realIcon = "tune"
      break;
  }
  return realIcon
}

View.prototype.createFooter = function() {
  let appName = this.getAppName()
  let copyrightDate = this.getCopyrightDate()
  let fabHTML = this.createFAB()

  f = document.createElement("footer")
  f.classList.add("mdl-mini-footer")
  f.innerHTML = `
      ${fabHTML}
      <div class="mdl-mini-footer__left-section"><span class="copyright-text">
        <i class="material-icons footer-icons">location_city</i>
        <i class="material-icons footer-icons" style="position:relative; left:-0.5em">favorite</i>
        <span class="copyright-text" style="position:relative; left:-1.5em">${appName} &copy; ${copyrightDate}</span>
      </div>
      <div class="mdl-mini-footer__right-section">
        <a href="${this.githubUrl}" target="_blank" title="github" ref="noreferrer noopener">
          <button id="button-octocat" class="mdl-button mdl-js-button mdl-js-ripple-effect">
            <i id="footer-icon-octocat" class="fab fa-github-square" aria-hidden="true"></i>
          </button>
        </a>
      </div>
    `
  return f
}
