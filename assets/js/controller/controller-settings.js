//----------------------------------------------------------------------------------
// Controller (for Edit Settings page)
//
// These methods define the event listeners associated with the settings view.
//
// The event handlers typically cause the settings model and view to be updated
// for attributes like:
//
//    * language / locale
//    * country of interest
//    * number of cities to display in results
//----------------------------------------------------------------------------------

Controller.prototype.getSettingsPageEventListeners = function() {
  return this.addSettingsPageEventListeners
}

Controller.prototype.addSettingsPageEventListeners = function() {
  fabEl = this.view.getFAB()
  if (fabEl) {
    this.delegatedHandlers.addEventListener(
          document,
          "click",
          "#floating-access-button",
          this.getFabEventListener(this.view.createPageBody.bind(this.view))
    )
  }

  this.delegatedHandlers.addEventListener(document, "click", "#dropdown-settings-language", (e) => {

      // BTW: This is very specific to the HTML idiom recommended by the 3rd-party
      //      'getmdl-select' extension we're using at the moment for pretty selection
      //      lists in MDL.  This would likely change if/when upgrading to MDC (web components).

      let inputEl = document.querySelector("#dropdown-settings-language input")
      let inputHiddenEl = document.querySelector("#dropdown-settings-language input[type='hidden']")

      let language = (inputEl && inputEl.value) ? inputEl.value : ""
      let locale = (inputHiddenEl && inputHiddenEl.value) ? inputHiddenEl.value : ""

      if (locale) {
        if (this.settings.setLocale(locale)) {

          // Persist to local storage.

          let settingsState = this.settings.get()
          this.cache.setSettings(settingsState)

          // Update view based upon locale in model.
          // TODO: This should go away once observer pattern is implemented.
          this.view.setLanguage()
        }
      }
    }
  )

  this.delegatedHandlers.addEventListener(document, "click", "#dropdown-settings-country", (e) => {

      // BTW: This is very specific to the HTML idiom recommended by the 3rd-party
      //      'getmdl-select' extension we're using at the moment for pretty selection
      //      lists in MDL.  This would likely change if/when upgrading to MDC (web components).

      let inputEl = document.querySelector("#dropdown-settings-country input")
      let inputHiddenEl = document.querySelector("#dropdown-settings-country input[type='hidden']")

      let country = (inputEl && inputEl.value) ? inputEl.value : ""
      let countryCode = (inputHiddenEl && inputHiddenEl.value) ? inputHiddenEl.value : ""

      if (countryCode) {
        if (this.settings.setCountryCode(countryCode)) {

          // Persist to local storage.

          let settingsState = this.settings.get()
          this.cache.setSettings(settingsState)

          // Update view based upon country-code in model.
          // TODO: This should go away once observer pattern is implemented.
          //
          // Since we can only selection one country for now, this is commented out.
          // this.view.setCountry()
        }
      }
    }
  )

  this.delegatedHandlers.addEventListener(document, "click", "#dropdown-settings-max-results", (e) => {

      // BTW: This is very specific to the HTML idiom recommended by the 3rd-party
      //      'getmdl-select' extension we're using at the moment for pretty selection
      //      lists in MDL.  This would likely change if/when upgrading to MDC (web components).

      let inputHiddenEl = document.querySelector("#dropdown-settings-max-results input[type='hidden']")
      let numCities = (inputHiddenEl && inputHiddenEl.value) ? inputHiddenEl.value : ""

      // Marshall possible string to integer.
      numCities = parseInt(numCities)

      if (numCities) {
        if (this.settings.setMaxResults(numCities)) {

          // Persist to local storage.

          let settingsState = this.settings.get()
          this.cache.setSettings(settingsState)

          // Update view based upon country-code in model.
          // TODO: This should go away once observer pattern is implemented.
          //
          this.view.setMaxResults()
        }
      }
    }
  )

  // Render hamburger menu and make responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
