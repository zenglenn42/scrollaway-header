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
//
// TODO: Move activeDataView to results-related component.
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
  githubUrl,
  hasPersistedSettings,
  getMaxResults,
  getMaxResultsOptions,
  getLangCode,
  getLangName,
  getLangOptionsMap,
  getCountryCode,
  getCountryName,
  getCountryOptionsMap,
  getLocale,
  getCurrency,
  getAffordabilityValue,
  getHappinessValue,
  getPoliticsValue,
  getAffordabilityEnabled,
  getHappinessEnabled,
  getPoliticsEnabled,
  getJobSearchEnabled,
  getNormalizedPriorities,
  hasNoPriorities,
  getAppName,
  getSlogan,
  getBlurb,
  getCopyrightDate
) {

  // Bind to LocalPersistence interface.
  this.hasPersistedSettings = hasPersistedSettings

  // Bind to SettingsModel interface.
  this.getMaxResults = getMaxResults
  this.getMaxResultsOptions = getMaxResultsOptions
  this.getLangCode = getLangCode
  this.getLangName = getLangName
  this.getLangOptionsMap = getLangOptionsMap
  this.getCountryCode = getCountryCode
  this.getCountryName = getCountryName
  this.getCountryOptionsMap = getCountryOptionsMap

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

  // Bind to LandingModel interface.
  this.getAppName = getAppName
  this.getSlogan = getSlogan
  this.getBlurb = getBlurb
  this.getCopyrightDate = getCopyrightDate

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

  // TODO: This state really should be managed in model.
  this.activeDataView = this.defaultDataView

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

View.prototype.createHamburgerMenu = function() {
  let m = document.createElement("div")
  m.classList.add("mdl-layout__drawer-button")
  m.setAttribute("role", "button")
  m.setAttribute("aria-expanded", "false")
  let iconEl = document.createElement("i")
  iconEl.classList.add("material-icons")
  iconEl.innerHTML = "menu"
  m.appendChild(iconEl)
  return m
}

View.prototype.createMenuDrawer = function(title="Menu", menuItemsArray=[]) {
  let md = document.createElement("span")
  md.classList.add("mdl-layout__drawer")
  let mdHeader = document.createElement("div")
  mdHeader.classList.add("mdl-layout__header-row")
  mdHeader.classList.add("mdl-layout-title")
  mdHeader.classList.add("mdl-menu__item--full-bleed-divider")
  mdHeader.innerHTML  = "<span>" + title + "</span>&nbsp;&nbsp;" 
  mdHeader.innerHTML += "<div class='mdl-layout-spacer'>"
  mdHeader.innerHTML += "<button id='dismiss_menu_button' class='mdl-button mdl-js-button mdl-button--icon'><i class='material-icons header-icons'>clear</i></button>"
  mdHeader.innerHTML += "</div>"
  md.appendChild(mdHeader)

  /*
  let nav = document.createElement("nav")
  nav.classList.add("mdl-navigation")
  let invariantMenuHtml = invariantMenuItems.map(item => {
    let anchor = document.createElement("a")
    anchor.classList.add("mdl-navigation__link")
    anchor.setAttribute("href", "")
    anchor.innerHTML = `${item}`
    return anchor
  })
  invariantMenuHtml.map(html => {
    md.appendChild(html)
  })
  let menuHtml = menuItemsArray.map(item => {
    let anchor = document.createElement("a")
    anchor.classList.add("mdl-navigation__link")
    anchor.setAttribute("href", "")
    anchor.innerHTML = `${item}`
    return anchor
    // return `<a class="mdl-navigation__link" href="">${item}</a>`
  })
  menuHtml.map(html => {
    md.appendChild(html)
  })
  */

  // TODO: DRY this up with a map lambda.

  let viewMenuButton = "button"
  let viewMenuButtonNode = document.createElement(viewMenuButton)
  viewMenuButtonNode.setAttribute("id", "viewMenu")
  viewMenuButtonNode.setAttribute("style", "text-align:left")
  viewMenuButtonNode.classList.add("mdl-button")
  viewMenuButtonNode.classList.add("mdl-js-button")
  viewMenuButtonNode.innerHTML = "<i class='material-icons header-icons'>visibility</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>View ...</span>"
  md.appendChild(viewMenuButtonNode)
  let viewMenuHtml = "ul"
  let viewMenuNode = document.createElement(viewMenuHtml)
  viewMenuNode.classList.add("mdl-menu")
  viewMenuNode.classList.add("mdl-js-menu")
  viewMenuNode.classList.add("mdl-menu--bottom-right")
  viewMenuNode.setAttribute("for", "viewMenu")
  viewMenuNode.innerHTML  = "<li class='mdl-menu__item mdl-button'><a href='' ref='noreferrer noopener' title='home'><i class='material-icons header-icons'>home</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>1. Introduction</span></a></li>",
  viewMenuNode.innerHTML += "<li id='view_values_button' class='mdl-menu__item mdl-button'><i class='material-icons header-icons'>tune</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>2. Your priorities</span></li>"
  viewMenuNode.innerHTML += "<li id='view_cities_button' class='mdl-menu__item mdl-button mdl-menu__item--full-bleed-divider'><i class='material-icons header-icons'>location_city</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>3. Your best bets</span></li>"
  viewMenuNode.innerHTML += "<li class='mdl-menu__item'><a href='" + this.githubUrl + "' target='_blank' ref='noreferrer noopener' title='blog'><i class='material-icons header-icons'>local_library</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>Blog</span></a></li>",
  md.appendChild(viewMenuNode)

  let settingsMenuButton = "button"
  let settingsMenuButtonNode = document.createElement(settingsMenuButton)
  settingsMenuButtonNode.setAttribute("id", "settingsMenu")
  settingsMenuButtonNode.setAttribute("style", "text-align:left")
  settingsMenuButtonNode.classList.add("mdl-button")
  settingsMenuButtonNode.classList.add("mdl-js-button")
  settingsMenuButtonNode.innerHTML = "<i class='material-icons header-icons'>settings</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>Settings ...</span>"
  md.appendChild(settingsMenuButtonNode)
  let settingsMenuHtml = "ul"
  let settingsMenuNode = document.createElement(settingsMenuHtml)
  let enableCacheClear = this.hasPersistedSettings() ? "" : "disabled='disabled'"
  settingsMenuNode.classList.add("mdl-menu")
  settingsMenuNode.classList.add("mdl-js-menu")
  settingsMenuNode.classList.add("mdl-menu--bottom-right")
  settingsMenuNode.setAttribute("for", "settingsMenu")
  let maxResultsString = "Show top " + this.getMaxResults() + " cities"
  let langString = "Use " + this.getLangName(this.getLangCode())
  let countryString = "Show cities in " + this.getCountryName(this.getCountryCode())

  settingsMenuNode.innerHTML = ""

  settingsMenuNode.innerHTML += "<li id='settings_edit_button' class='mdl-menu__item mdl-button mdl-menu__item--full-bleed-divider'><i class='material-icons header-icons'>edit</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>Edit ...</span></li>",

  settingsMenuNode.innerHTML += "<li class='mdl-menu__item' style='margin-top: 1em; height: 2em; line-height: 1em' disabled><span>" + langString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item' style='height: 2em; line-height: 1em' disabled><span>" + countryString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item--full-bleed-divider' style='height: 2em; line-height: 1em' disabled><span id='settings-max-results-menu'>" + maxResultsString + "</span></li>"

  // Move these next two to the dedicated settings edit page to simplify model/view updates.
  // settingsMenuNode.innerHTML += "<li disabled id='settings_restore_button' class='mdl-menu__item mdl-button'><i class='material-icons header-icons'>restore_page</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>Restore defaults</span></li>",
  // settingsMenuNode.innerHTML += "<li disabled id='settings_clearcache_button' class='mdl-menu__item mdl-button'" + enableCacheClear + "><i class='material-icons header-icons'>clear</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>Clear cached settings</span></li>",

  md.appendChild(settingsMenuNode)

  let helpMenuButton = "button"
  let helpMenuButtonNode = document.createElement(helpMenuButton)
  helpMenuButtonNode.setAttribute("id", "helpMenu")
  helpMenuButtonNode.setAttribute("style", "text-align:left")
  helpMenuButtonNode.setAttribute("disabled", "disabled")
  helpMenuButtonNode.classList.add("mdl-button")
  helpMenuButtonNode.classList.add("mdl-js-button")
  helpMenuButtonNode.innerHTML = "<i class='material-icons header-icons'>help</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>Help</span>"
  md.appendChild(helpMenuButtonNode)

  return md
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
