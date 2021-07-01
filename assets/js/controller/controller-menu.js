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
    that.cities.restoreDefaultSettings()
    that.view.setMaxResults()  // TODO: really should be something like that.view.setState()
                               //       Should rebuild modal-occluded page to reflect restored state.
                               //       Really need an update-view entrypoint that.view.update()
                               //       React is calling since it handles this kind of shizzle. (-:
    if (that.cache.hasSettingsCB()) {
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
