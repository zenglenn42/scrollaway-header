//----------------------------------------------------------------------------------
// Settings Page
//
// These view methods update the browser DOM to render the 'Edit settings'
// screen.
//----------------------------------------------------------------------------------

View.prototype.setMaxResults = function() {

  // TODO: Split this out to a menu component?
  let settingsLabelMaxResultsEl = document.querySelector("#label-settings-max-results")
  if (settingsLabelMaxResultsEl) {
    settingsLabelMaxResultsEl.innerHTML = `${this.getMenuSettingsShowTop(this.getMaxResults())}`
  }

  // TODO: Split this out to a menu component?
  let settingsMenuMaxResultsEl = document.querySelector("#settings-max-results-menu")
  if (settingsMenuMaxResultsEl) {
    settingsMenuMaxResultsEl.innerHTML = `${this.getMenuSettingsShowTop(this.getMaxResults())}`
  }
}

View.prototype.setLanguage = function() {
  // TODO: Split this out to a menu component?
  let settingsMenuLanguageEl = document.querySelector("#settings-language-menu")
  if (settingsMenuLanguageEl) {
    settingsMenuLanguageEl.innerHTML = 
          `${this.getMenuSettingsUseLang(this.getLangName(this.getLocale()))}`
  }

  // Recreate the settings page under the new language/locale.
  //
  // TODO: Not crazy about this.  Really should be happening as a result
  //       of state change in the model rather than element change in view.

  this.createSettingsBody()
}

View.prototype.createSettingsBody = function createSettingsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId)

  this.removeChildNodes(bodyDiv)

  let title = this.getAppName()
  let subTitle  = this.getSettingsTitle()
  let header = this.createHeader(title, [
        {id: 'nav-lang-button', icon: 'language',       tooltip: 'language', enabled: false},
        {id: 'nav-acct-button', icon: 'account_circle', tooltip: 'login',    enabled: false}],
        subTitle)

  let menuDrawer = this.createMenuDrawer()
  this.addMenuDrawerEventListeners()
  let hamburgerMenu = this.createHamburgerMenu()
  let mainSettings = this.createSettingsMain()
  let footer = this.createFooter()

  this.addHeader(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainSettings)
  bodyDiv.appendChild(footer)

  this.addSettingsPageEventListeners()

  // Add event listeners for dynamically added 3rd party dropdown-selection 
  // elements.
  //
  // TODO:  Add some abstraction around this.
  getmdlSelect.init('.getmdl-select')
}

View.prototype.getLangListItems = function(langMap) {
  let langListItems = Object.keys(langMap).reduce((acc, langKey, i) => {
    let name = langMap[langKey].name
    let supported = langMap[langKey].supported
    let currentKey = this.getLocale()
    let selected = (currentKey === langKey) ? `data-selected="true"` : ''
    let disabled = ""

    // Snip this feature out while integrating getmdl-select.
    // if (!supported) {
    //   disabled="disabled"
    // }

    let li = `<li id="language-${i+1}" data-val="${langKey}" data-value="${langKey}" ${selected} ${disabled}
                  class="mdl-menu__item">
                  ${name}
              </li>`
    acc += li
    return acc
  }, "")
  return langListItems
}

View.prototype.getLangDropdown = function(langListItems) {
  let html = `
      <div id="dropdown-settings-language"
           class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label
                  getmdl-select getmdl-select__fix-height getmdl-select_fix-width settings-textfield">
        <input id="settings-language" type="text" value="" class="mdl-textfield__input" readonly>
        <input type="hidden" value="" name="settings-language"/>
        <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
        <label class="mdl-textfield__label" for="settings-language">Select language</label>
        <ul for="settings-language" class="mdl-menu mdl-menu--bottom-right mdl-js-menu">
            ${langListItems}
        </ul>
      </div>`
  return html
}

View.prototype.getEditLangSetting = function(langLabel, langDropdown) {
  let html = `
      <div class='mdl-cell mdl-cell--6-col settings-cell'>
        <span>
          <label class="mdl-button mdl-js-button mdl-button--icon" for="languageId">
            <i  class="material-icons">language</i>
          </label>
          ${langLabel}
        </span>
        ${langDropdown}
      </div>`
  return html
}

View.prototype.getCountryListItems = function(countryMap) {
  let countryListItems = Object.keys(countryMap).reduce((acc, countryKey, i) => {
    let name = countryMap[countryKey].name
    let currentKey = this.getCountryCode()
    let selected = (currentKey === countryKey) ? `data-selected="true"` : ''
    let supported = countryMap[countryKey].supported
    if (supported) {
      let li = `<li id="country-${i+1}" data-val="${countryKey}" data-value="${countryKey}" ${selected}
                    class="mdl-menu__item">
                    ${name}
                </li>`
      acc += li
    }
    return acc
  }, "")
  return countryListItems
}

View.prototype.getCountryDropdown = function(countryListItems) {
  let html = `
      <div id="dropdown-settings-country"
           class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label
                  getmdl-select getmdl-select__fix-height getmdl-select_fix-width settings-textfield">
        <input id="settings-country" type="text" value="" class="mdl-textfield__input" readonly>
        <input type="hidden" value="" name="settings-country"/>
        <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
        <label class="mdl-textfield__label" for="settings-country">${this.getSelectCountry()}</label>
        <ul for="settings-country" class="mdl-menu mdl-menu--bottom-right mdl-js-menu">
          ${countryListItems}
        </ul>
      </div>`
  return html
}

View.prototype.getEditCountrySetting = function(countryLabel, countryDropdown) {
  let html = `
    <div class='mdl-cell mdl-cell--6-col settings-cell'>
      <span>
        <label class="mdl-button mdl-js-button mdl-button--icon" for="countryId">
          <i  class="material-icons">travel_explore</i>
        </label>
        ${countryLabel}
      </span>
      ${countryDropdown}
    </div>`
  return html
}

View.prototype.getMaxResultsListItems = function(maxResultsOptions = []) {
  let maxResultsListItems = (maxResultsOptions.map((numCities, i) => {
      let currentNum = this.getMaxResults()
      let selected = (currentNum === numCities) ? `data-selected="true"` : ''
      let li = `<li id="maxResults-${i+1}" data-val="${numCities}" data-value="${numCities}" ${selected}
                      class="mdl-menu__item">
                      ${numCities}
                </li>`
      return li
    }).reduce((acc, li) => {acc += li; return acc}, ""))
  return maxResultsListItems
}

View.prototype.getMaxResultsDropdown = function(maxResultsListItems) {
  let html = `
      <div id="dropdown-settings-max-results"
           class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label
                  getmdl-select getmdl-select__fix-height getmdl-select_fix-width settings-textfield">
        <input id="settings-max-results" type="text" value="" class="mdl-textfield__input" readonly>
        <input type="hidden" value="" name="settings-max-results"/>
        <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
        <label class="mdl-textfield__label" for="settings-max-results">${this.getSelectQuantity()}</label>
        <ul for="settings-max-results" class="mdl-menu mdl-menu--bottom-right mdl-js-menu">
          ${maxResultsListItems}
        </ul>
      </div>`
  return html
}

View.prototype.getEditMaxResultsSetting = function(maxResultsLabel, maxResultsDropdown) {
  let html = `
    <div class='mdl-cell mdl-cell--6-col settings-cell'>
      <span>
        <label class="mdl-button mdl-js-button mdl-button--icon" for="maxResultsId">
          <i  class="material-icons">location_city</i>
        </label>
        <span id="label-settings-max-results">
          ${maxResultsLabel}
        </span>
      </span>
      ${maxResultsDropdown}
    </div>`
  return html
}

View.prototype.getVerticalCellPadding = function(repeatFactor = 1) {
  let paddedCell = `
    <div class='mdl-cell mdl-cell--6-col settings-cell'>
      &nbsp;
    </div>`
  return paddedCell.repeat(repeatFactor)
}

View.prototype.createSettingsMain = function() {
  let m = document.createElement("main")
  m.setAttribute("id", "main")
  m.classList.add("mdl-layout__content")
  let child = document.createElement("div")
  child.classList.add("grid-content")
  m.appendChild(child)
  let g = document.createElement("div")
  g.classList.add("mdl-grid")
  g.classList.add("settings-grid")

  let langLabel = this.getMenuSettingsUseLang(this.getLangName(this.getLocale()))
  let langListItems = this.getLangListItems(this.getLangOptionsMap())
  let langDropdown = this.getLangDropdown(langListItems)
  let editLangSetting = this.getEditLangSetting(langLabel, langDropdown)

  let countryLabel = this.getMenuSettingsShowCities(this.getCountryName(this.getCountryCode()))
  let countryListItems = this.getCountryListItems(this.getCountryOptionsMap())
  let countryDropdown = this.getCountryDropdown(countryListItems)
  let editCountrySetting = this.getEditCountrySetting(countryLabel, countryDropdown)

  let maxResultsLabel = this.getMenuSettingsShowTop(this.getMaxResults())
  let maxResultsListItems = this.getMaxResultsListItems(this.getMaxResultsOptions())
  let maxResultsDropdown = this.getMaxResultsDropdown(maxResultsListItems)
  let editMaxResultsSetting = this.getEditMaxResultsSetting(maxResultsLabel, maxResultsDropdown)

  let verticalCellPadding = this.getVerticalCellPadding(4)

  g.innerHTML = `
  <div>
    <!-- Select language -->
    ${editLangSetting}

    <!-- Select country -->
    ${editCountrySetting}

    <!-- Select city quantity -->
    ${editMaxResultsSetting}

    <!-- Adding dummy cell for bottom padding to avoid proximity to FAB.        -->
    <!-- Probably a more elegant way to do this ... like bottom-margin on grid. -->

    ${verticalCellPadding}
  </div>
  `
  m.appendChild(g)
  return m
}
