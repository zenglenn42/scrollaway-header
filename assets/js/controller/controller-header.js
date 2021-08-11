//----------------------------------------------------------------------------------
// Controller (for app header)
//
// These methods define the event listeners associated with the header / nav view.
//
//----------------------------------------------------------------------------------

Controller.prototype.getHeaderEventListeners = function() {
  return this.addHeaderEventListeners
}

Controller.prototype.addHeaderEventListeners = function() {
  let homeTitleEl = document.getElementById("nav-title-text")
  if (homeTitleEl) {
    this.delegatedHandlers.addEventListener(document, "click", "#nav-title-text", (e) => {
        this.FAB.set({pageState: "dontcare_landing"})
        this.cache.setFAB(this.FAB.get())
        this.view.createPageBody("landing")
      }
    )
  }

  this.delegatedHandlers.addEventListener(document, "click", "#dropdown-nav-language", (e) => {

      // BTW: This is very specific to the HTML idiom recommended by the 3rd-party
      //      'getmdl-select' extension we're using at the moment for pretty selection
      //      lists in MDL.  This would likely change if/when upgrading to MDC (web components).

      let inputEl = document.querySelector("#dropdown-nav-language input")
      let inputHiddenEl = document.querySelector("#dropdown-nav-language input[type='hidden']")

      let language = (inputEl && inputEl.value) ? inputEl.value : ""
      let locale = (inputHiddenEl && inputHiddenEl.value) ? inputHiddenEl.value : ""
      let currLocale = this.settings.getLocale()

      if (locale && locale !== currLocale) {
        if (this.settings.setLocale(locale)) {

          // Persist to local storage.

          let settingsState = this.settings.get()
          this.cache.setSettings(settingsState)

          // Update view based upon locale in model.
          // TODO: This should go away once observer pattern is implemented.
          this.view.setLanguage()
        }
      } else {
        console.log("[Info] Event handler for #dropdown-nav-language: Unrecognized locale", locale, "Ignoring")
      }
    }
  )
}
