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
  let homeEl = document.getElementById("nav-home-button")
  if (homeEl) {
    homeEl.addEventListener(
      "click",
      (e) => {
        this.FAB.set({pageState: "dontcare_landing"})
        this.cache.setFAB(this.FAB.get())
        this.view.createLandingBody()
      }
    )
  }

  let homeTitleEl = document.getElementById("nav-title-text")
  if (homeTitleEl) {
    homeTitleEl.addEventListener(
      "click",
      (e) => {
        this.FAB.set({pageState: "dontcare_landing"})
        this.cache.setFAB(this.FAB.get())
        this.view.createLandingBody()
      }
    )
  }

  fabEl = this.view.getFAB()
  if (fabEl) {
    gotoPage = fabEl.getAttribute("data-goto-page") || "landing"

    switch(gotoPage) {
      case "priorities":
        fabEl.addEventListener(
          "click",
          this.getFabEventListener(this.view.createPrioritiesBody.bind(this.view))
        )
        break

      case "results":
        fabEl.addEventListener(
          "click",
          this.getFabEventListener(this.view.createResultsBody.bind(this.view))
        )
        break

      case "landing":
      default:
        fabEl.addEventListener(
          "click",
          this.getFabEventListener(this.view.createLandingBody.bind(this.view))
        )
        break
    }
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

      //let inputEl = document.querySelector("#dropdown-settings-max-results input")
      let inputHiddenEl = document.querySelector("#dropdown-settings-max-results input[type='hidden']")

      //let numCities = (inputEl && inputEl.value) ? inputEl.value : ""
      let numCities = (inputHiddenEl && inputHiddenEl.value) ? inputHiddenEl.value : ""
      numCities = (typeof numCities === 'string') ? JSON.parse(numCities) : numCities

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

  // Make hamburger menu responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
