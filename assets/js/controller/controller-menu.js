//----------------------------------------------------------------------------------
// Controller (for Menu)
//
// These methods define the event listeners associated with the application menu.
//
// The event handlers typically cause the menu model and view to be updated.
//----------------------------------------------------------------------------------
// TODO: Allow the view to subscribe to model-state changes.
//
//       Currently the controller shoulders responsibility for keeping the view
//       synchronized with the models.
//
// TODO: Enable persistence of state between user sessions by integrating storage
//       layer.
//----------------------------------------------------------------------------------

Controller.prototype.getMenuDrawerEventListeners = function() {
  return this.addMenuDrawerEventListeners
}

Controller.prototype.addMenuDrawerEventListeners = function() {
  var that = this
  this.delegate(document, "click", "#dismiss_menu_button", function(e) {
     let md = document.querySelector(".mdl-layout__drawer")
     if (md) {
       md.classList.remove("is-visible")
     }
     let modalObfuscator = document.querySelector(".mdl-layout__obfuscator")
     if (modalObfuscator) {
       modalObfuscator.classList.remove("is-visible")
     }
  })
  this.delegate(document, "click", "#view_landing_button", function(e) {
    // TODO: Replace this with that.FAB.setCurrPage and infer prevPage?
    that.FAB.set({pageState: "dontcare_landing"})
    // Persist to local storage
    that.cache.setFAB(that.FAB.get())
    that.view.createLandingBody()
  })
  this.delegate(document, "click", "#view_priorities_button", function(e) {
    // TODO: Replace this with that.FAB.setCurrPage and infer prevPage?
    that.FAB.set({pageState: "landing_priorities"})
    // Persist to local storage
    that.cache.setFAB(that.FAB.get())
    that.view.createPrioritiesBody()
  })
  this.delegate(document, "click", "#view_cities_button", function(e) {
    // TODO: Replace this with that.FAB.setCurrPage and infer prefPage?
    that.FAB.set({pageState: "priorities_results"})
    // Persist to local storage
    that.cache.setFAB(that.FAB.get())
    that.view.createResultsBody()
  })
  this.delegate(document, "click", "#settings_edit_button", function(e) {
    that.FAB.setNextPageState("settings")
    // Persist to local storage
    that.cache.setFAB(that.FAB.get())
    that.view.createSettingsBody()
  })
  this.delegate(document, "click", "#settings_restore_button", function(e) {
    that.settings.restoreDefaults()

    // Assume that restoring to defaults implies clearing whatever
    // (potentially) non-default settings are currently cached in local storage.

    if (that.cache.hasSettings()) {
      if (that.cache.clearSettings()) {
        let clearcache_button = document.querySelector("#settings_clearcache_button")
        if (clearcache_button) {
          clearcache_button.setAttribute("disabled", "disabled")
        }
      }
    }

    // Forget memory of current page.
    //
    // TODO: Disable restore button?

    if (that.cache.hasFAB()) {
      if (that.cache.clearFAB()) {
        //let clearcache_button = document.querySelector("#settings_clearcache_button")
        //if (clearcache_button) {
        //  clearcache_button.setAttribute("disabled", "disabled")
        //}
      }
    }

    // Update the current view to reflect changes in the settings model.

    // Here we're using flow synchronization to keep the view updated.
    // Once the models become observable, the re-render methods for the active
    // views will be invoked from within the mutated models as a side-effect
    // of the changed state and we'll not need the code below.

    let currPage = that.FAB.getCurrPage()
    switch(currPage) {
      case "landing":
        that.view.createLandingBody()
        break
      case "settings":
        that.view.createSettingsBody()
        break
      case "priorities":
        that.view.createPrioritiesBody()
        break
      case "results":
        that.view.createResultsBody()
        break
      default:
        that.view.createLandingBody()
    }
  })

  this.delegate(document, "click", "#settings_clearcache_button", function(e) {
    if (that.cache.clearSettings()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.setAttribute("disabled", "disabled")
      }
    }
  })
}
