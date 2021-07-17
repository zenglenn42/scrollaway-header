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
  this.delegate(document, "click", "#view_values_button", function(e) {
    that.view.createPrioritiesBody()
  })
  this.delegate(document, "click", "#view_cities_button", function(e) {
    that.view.createResultsBody()
  })
  this.delegate(document, "click", "#settings_edit_button", function(e) {
    that.view.createSettingsBody()
  })
  this.delegate(document, "click", "#settings_restore_button", function(e) {
    that.settings.restoreDefaults()

    that.view.setMaxResults()     //
    //that.view.setLocale()       // TODO: Ug, this really should be something like
    //that.view.setCountryCode()  //       that.view.update(that.settings) if using flow-sync.
                                  //       Otherwise the view should just be an observer of
                                  //       settings model which invokes registered update-view
                                  //       callbacks upon state change (if using observer-sync).
                                  //


    // Assume that restoring to defaults implies clearing whatever
    // (potentially non-default) settings currently cached in local storage.

    if (that.cache.hasSettings()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.removeAttribute("disabled")
      }
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
