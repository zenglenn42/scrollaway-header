//----------------------------------------------------------------------------------
// Settings Page
//
// These view methods update the browser DOM to render the 'Edit settings'
// screen.
//----------------------------------------------------------------------------------
// TODO: Replace hardcoded presentation text with calls to (locale-sensitive)
//       model getter methods.
//
//       This will enable localization support.
//----------------------------------------------------------------------------------

View.prototype.setMaxResults = function() {
  let settingsPageMaxResultsEl = document.querySelector("#settings-max-results-selected")
  if (settingsPageMaxResultsEl) {
    settingsPageMaxResultsEl.innerHTML = this.getMaxResults()
  }
  // TODO: Split this out to a menu component?
  let settingsMenuMaxResultsEl = document.querySelector("#settings-max-results-menu")
  if (settingsMenuMaxResultsEl) {
    settingsMenuMaxResultsEl.innerHTML = "Show top " + this.getMaxResults() + " cities"
  }
}

View.prototype.createSettingsBody = function createSettingsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId)

  // Fetch the page we should navigate back to (from the FAB)
  // after we're done editing settings.

  let backToPage = "landing"  // default

  let currMain = document.getElementById("main")
  if (currMain) {
    let currPage = currMain.getAttribute("data-currpage")
    backToPage = currPage || "landing"
  }

  bodyDiv.innerHTML = ""
  let header = this.createHeader(
        "Edit settings ...", "")
  let menuDrawer = this.createMenuDrawer()
  let hamburgerMenu = this.createHamburgerMenu()
  let mainSettings = this.createSettingsMain(backToPage)
  let footer = this.createFooter("navigate_before", "navigate_next", backToPage)

  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainSettings)
  bodyDiv.appendChild(footer)

  this.addSettingsPageEventListeners()
}

View.prototype.createSettingsMain = function(backToPage="landing") {
  let m = document.createElement("main")
  m.setAttribute("id", "main")
  m.setAttribute("data-currpage", backToPage)
  m.classList.add("mdl-layout__content")
  let child = document.createElement("div")
  child.classList.add("grid-content")
  m.appendChild(child)
  let g = document.createElement("div")
  g.classList.add("mdl-grid")
  g.classList.add("settings-grid")

  // List items for 'max results' dropdown selection list box.
  // Turn settings model for max results options into presentation elements (list items).

  let maxResultsListItems = (this.getMaxResultsOptions().map((numCities, i) => {
      return `<li id="maxResults-${i + 1}" data-value="${numCities}" class="mdl-menu__item settings-max-results__button">${numCities}</li>`
  }).reduce((acc, li) => {acc += li; return acc}, ""))

  // List items for language selection dropdown list box.

  let langMap = this.getLangOptionsMap()
  let langListOptions = Object.keys(langMap).reduce((acc, langKey, i) => {
    let name = langMap[langKey].name
    let supported = langMap[langKey].supported
    let disabled = undefined
    if (!supported) {
      disabled="disabled"
    }
    let li = `<li ${disabled} id="language-${i+1}" data-value="${langKey}" class="mdl-menu__item settings-language__button">${name}</li>`
    acc += li
    return acc
  }, "")

  // List items for country selection dropdown list box.

  let countryMap = this.getCountryOptionsMap()
  let countryListOptions = Object.keys(countryMap).reduce((acc, countryKey, i) => {
    let name = countryMap[countryKey].name
    let supported = countryMap[countryKey].supported
    let disabled = undefined
    if (!supported) {
      disabled="disabled"
    }
    let li = `<li ${disabled} id="country-${i+1}" data-value="${countryKey}" class="mdl-menu__item settings-country__button">${name}</li>`
    acc += li
    return acc
  }, "")

  let langString = this.getLangName(this.getLangCode())
  let countryString = this.getCountryName(this.getCountryCode())

  g.innerHTML = `
    <div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      <span>
        <label class="mdl-button mdl-js-button mdl-button--icon" for="languageId">
          <i  class="material-icons">translate</i>
        </label>
        Select language
      </span>
      <div class="mdl-textfield mdl-js-textfield">
        <span>Use &nbsp;</span>
        <span class="selected-value">${langString}</span>
        <button id="settings-language" class="mdl-button mdl-js-button dropdown-button">
          <i class="material-icons dropdown-button-icon">arrow_drop_down</i>
        </button>
        <ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right"
            data-mdl-for="settings-language">
            ${langListOptions}
        </ul>
      </div>
    </div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      <span>
        <label class="mdl-button mdl-js-button mdl-button--icon" for="countryId">
          <i  class="material-icons">travel_explore</i>
        </label>
        Select country
      </span>
      <div class="mdl-textfield mdl-js-textfield">
        <span>Show cities in &nbsp;</span>
        <span class="selected-value">${countryString}</span>
        <button id="settings-country" class="mdl-button mdl-js-button dropdown-button">
          <i class="material-icons dropdown-button-icon">arrow_drop_down</i>
        </button>
        <ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right"
            data-mdl-for="settings-country">
          ${countryListOptions}
        </ul>
      </div>
    </div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      <span>
        <label class="mdl-button mdl-js-button mdl-button--icon" for="settings-max-results">
          <i  class="material-icons">location_city</i>
        </label>
        Select quantity
      </span>

      <div class="mdl-textfield mdl-js-textfield">
        <span>Show top &nbsp;</span> 
        <span id="settings-max-results-selected" class="selected-value">${this.getMaxResults()}</span>
        <button id="settings-max-results" class="mdl-button mdl-js-button dropdown-button">
          <i class="material-icons dropdown-button-icon">arrow_drop_down</i>
        </button>
        <span>cities</span>
        <ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right"
            data-mdl-for="settings-max-results">
          ${maxResultsListItems}
        </ul>
      </div>

    </div>
    <!-- Adding dummy cell for bottom padding to avoid proximity to FAB.  
         Probably a more elegant way to do this ... like bottom-margin on grid. -->
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      &nbsp;
    </div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      &nbsp;
    </div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      &nbsp;
    </div>
    <div class='mdl-cell mdl-cell--4-col settings-cell'>
      &nbsp;
    </div>
    </div>
  `
  m.appendChild(g)
  return m
}
