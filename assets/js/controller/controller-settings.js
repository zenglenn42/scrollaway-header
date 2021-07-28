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
  let homeEl = document.getElementById("header-home-button")
  homeEl.addEventListener(
    "click",
    (e) => {
      this.FAB.set({pageState: "dontcare_landing"})
      this.cache.setFAB(this.FAB.get())
      this.view.createLandingBody()
    }
  )

  fabEl = this.view.getFAB()
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

  languageButtons = [...document.querySelectorAll(".settings-language__button")]
  languageButtons.map(button => {
      button.addEventListener(
        "click",
        (e) => {
           let buttonEl = e.srcElement
           let id = buttonEl.getAttribute("id")
           let localeAttr = buttonEl.getAttribute("data-value") || "en-US"
           if (this.settings.setLocale(localeAttr)) {

             // Persist to local storage.

             let settingsState = this.settings.get()
             this.cache.setSettings(settingsState)


             // Update view based upon locale in model.
             // TODO: This should go away once observer pattern is implemented.
             this.view.setLanguage()
           }
           // console.log(`set locale to ${localeAttr}`)
     })
  })


  maxResultsButtons = [...document.querySelectorAll(".settings-max-results__button")]
  maxResultsButtons.map(button => {
      let value = JSON.parse(button.getAttribute("data-value"))
      button.addEventListener(
        "click",
        (e) => {
           let buttonEl = e.srcElement
           let id = buttonEl.getAttribute("id")
           let attrValue = buttonEl.getAttribute("data-value") || "10"
           let value = JSON.parse(attrValue)
           if (this.settings.setMaxResults(value)) {
             // Persist to local storage.

             let settingsState = this.settings.get()
             this.cache.setSettings(settingsState)

             // Update view based upon locale in model.
             // TODO: This should go away once observer pattern is implemented.
             this.view.setMaxResults()
           }
           // console.log(`click show top ${value} cities`)
     })
  })

  // Make hamburger menu responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
