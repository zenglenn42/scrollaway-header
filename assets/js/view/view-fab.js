//----------------------------------------------------------------------------------
// FAB (floating action button)
//
// These view methods render the application's floating action button used to
// navigate from page to page (typically at the bottom of the screen centered
// over the footer on mobile devices or smaller screen geometries).
//
// State is fetched through getter methods for the FAB model.
//----------------------------------------------------------------------------------
// TODO: Allow the view to subscribe to model-state changes.  
//
//       Currently the controller shoulders responsibility for keeping the view 
//       synchronized with the models.  Eventually the view will include render()
//       methods that can be registered with and invoked by the models in response
//       to state changes therein.
//
// TODO: Should probably create FAB as a singleton since there is only one per app.
//----------------------------------------------------------------------------------

View.prototype.createFAB = function(fabId = "floating-access-button") {
  this.fabId = fabId  // Save stateful fab element id.

  let fabClasses  = "footer-fab mdl-button mdl-js-button mdl-button--fab "
      fabClasses += "mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary"

  let fabProps = this.fabModel.getProps()
  let fabIcon = this.getIconFromAsciiIcon(fabProps.fabIcon)
  let fabPage = fabProps.fabPage
  let fabVisibility = this.fabModel.getVisibility() ? "visible" : "hidden"

  let fabHTML = `
    <button id="${this.fabId}"
            class="${fabClasses}"
            data-goto-page="${fabPage}"
            style="visibility: ${fabVisibility}">
      <i class="material-icons">${fabIcon}</i>
    </button>
  `
  return fabHTML
}

View.prototype.getFAB = function() {
  // TODO: Add error handling.
  let fabEl = document.getElementById(this.fabId)
  return fabEl
}
