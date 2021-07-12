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
  hasPersistedSettings,
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
  getMenuSettings,
  getMenuSettingsEdit,
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

  // Bind to LocalPersistence interface.
  this.hasPersistedSettings = hasPersistedSettings

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
  this.getMenuSettings = getMenuSettings
  this.getMenuSettingsEdit = getMenuSettingsEdit
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
  this.githubUrl = githubUrl

  let locale = getLocale()
  let currency = getCurrency(getCountryCode())

  this.formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0
  })

  this.resultsMain = undefined
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
        <!--
          <a class="mdl-navigation__link" href="">
            <i id="header-search" class="material-icons">${rightNavIcon}</i>
          </a>
        -->
          <a id="header-logo__link" class="mdl-navigation__link mdl-button mdl-js-button mdl-button--icon" href="" title="home" ref="noreferrer noopener">
            <i class='material-icons header-icons'>home</i>
          </a>
      </nav>
    `
  return h
}

View.prototype.makeNav = function(bodyDiv, header, menuDrawer, hamburgerMenu) {
  bodyDiv.appendChild(header)
  bodyDiv.appendChild(menuDrawer)
  bodyDiv.appendChild(hamburgerMenu)
}

View.prototype.createFooter = function(fabIcon="navigate_next", fabIconId="navigate_next", nextPage="priorities") {
  let appName = this.getAppName()
  let copyrightDate = this.getCopyrightDate()

  f = document.createElement("footer")
  f.classList.add("mdl-mini-footer")
  f.innerHTML = `
      <button id="${fabIconId}" data-nextpage="${nextPage}" class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary">
        <i class="material-icons">${fabIcon}</i>
      </button>
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
