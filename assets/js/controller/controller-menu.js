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

  this.delegatedHandlers.addEventListener(document, "click", "#dismiss_menu_button", function(e) {
     let md = document.querySelector(".mdl-layout__drawer")
     if (md) {
       md.classList.remove("is-visible")
     }
     let modalObfuscator = document.querySelector(".mdl-layout__obfuscator")
     if (modalObfuscator) {
       modalObfuscator.classList.remove("is-visible")
     }
  })

  this.delegatedHandlers.addEventListener(document, "click", "#view_landing_button", function(e) {
    that.FAB.set({pageState: "dontcare_landing"})
    that.cache.setFAB(that.FAB.get()) // Persist to local storage.
    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#view_priorities_button", function(e) {
    that.FAB.set({pageState: "landing_priorities"})
    that.cache.setFAB(that.FAB.get()) // Persist to local storage.
    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#view_cities_button", function(e) {
    that.FAB.set({pageState: "priorities_results"})
    that.cache.setFAB(that.FAB.get()) // Persist to local storage.
    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#prioritiesMenu", function(e) {
    // Normally we only persist user priorities when transitioning from
    // priorities page to results page (implicit 'submit' event).
    // But this is also a logical place for that.
    that.cache.setPriorities(that.priorities.get()) 

    // Update view state of menu with latest model state.
    // This should go away once models become observable.
    that.view.renderMenuPriorities()

    // TODO: FIX multiplicty of event listeners!!
    // Noticing multiple clicks when there should only be one.
    // Suspect i'm leaking event handlers.
    // console.log('click')
  })

  this.delegatedHandlers.addEventListener(document, "click", "#priorities_edit_button", function(e) {
    that.FAB.set({pageState: "landing_priorities"})
    that.cache.setFAB(that.FAB.get()) // Persist to local storage.
    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#priorities_restore_button", function(e) {
    that.priorities.restoreDefaults()

    // Assume that restoring to defaults implies clearing whatever
    // (potentially) non-default settings are currently cached in local storage.

    if (that.cache.hasPriorities()) {
      if (that.cache.clearPriorities()) {
        let clearcache_button = document.querySelector("#priorities_clearcache_button")
        if (clearcache_button) {
          clearcache_button.setAttribute("disabled", "disabled")
        }
      }
    }
    // Update the current view to reflect changes in the priorities model.

    // Here we're using flow synchronization to keep the view updated.
    // Once the models become observable, the re-render methods for the active
    // views will be invoked from within the mutated models as a side-effect
    // of the changed state and we'll not need the code below.

    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#priorities_clearcache_button", function(e) {
    if (that.cache.clearPriorities()) {
      let clearcache_button = document.querySelector("#priorities_clearcache_button")
      if (clearcache_button) {
        clearcache_button.setAttribute("disabled", "disabled")
      }
    }
  })
  
  this.delegatedHandlers.addEventListener(document, "click", "#settings_edit_button", function(e) {
    that.FAB.setNextPageState("settings")
    that.cache.setFAB(that.FAB.get()) // Persist to local storage.
    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#settings_restore_button", function(e) {
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

    if (that.cache.hasFAB()) {
      if (that.cache.clearFAB()) {
        // TODO: Disable restore-defaults button since we're now in default state?
        //
        // let restore_button = document.querySelector("#settings_restore_button")
        // if (restore_button) {
        //   restore_button.setAttribute("disabled", "disabled")
        // }
      }
    }

    // Forget memory of current results data-view.
    //
    // We're kinda aliasing 'restore default settings' to restore /all/ app defaults
    // except for user priorities.  That gets its own button.

    that.results.restoreDefaults()
    if (that.cache.hasResults()) {
      that.cache.clearResults()
    }

    // Update the current view to reflect changes in the settings model.

    // Here we're using flow synchronization to keep the view updated.
    // Once the models become observable, the re-render methods for the active
    // views will be invoked from within the mutated models as a side-effect
    // of the changed state and we'll not need the code below.

    that.view.render()
  })

  this.delegatedHandlers.addEventListener(document, "click", "#settings_clearcache_button", function(e) {
    if (that.cache.clearSettings()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.setAttribute("disabled", "disabled")
      }
    }
  })
}
