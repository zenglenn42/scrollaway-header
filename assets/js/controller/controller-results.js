//----------------------------------------------------------------------------------
// Controller (for Results page)
//
// These methods define the event listeners associated with the results view.
//
// The event handlers typically cause the results view to be updated.
// Examples of this include:
//
//    * returning to the priorities page when the fab (<>) is clicked
//
//    * changinge how the results are formatted (e.g., photo-view, list-view,
//      chart-view, map-view)
//----------------------------------------------------------------------------------
// TODO: Add a results model to mutate.
//----------------------------------------------------------------------------------

Controller.prototype.getResultsPageEventListeners = function() {
  return this.addResultsPageEventListeners
}

Controller.prototype.addResultsPageEventListeners = function() {
  let fabEl = this.view.getFAB()
  if (fabEl) {
    this.delegatedHandlers.addEventListener(
          document,
          "click",
          "#floating-access-button",
          this.getFabEventListener(this.view.createPageBody.bind(this.view))
    )
  }

  viewButtons = document.getElementsByClassName("view-link")
  if (viewButtons) {
    for (let i = 0; i < viewButtons.length; ++i) {
      let el = viewButtons[i]
      el.addEventListener("click", this.getViewButtonEventListener())
    }
  }

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}

Controller.prototype.getViewButtonEventListener = function() {
  let that = this
  function innerFunction() {
    let clickedViewId = this.getAttribute("id")

    // Update model based upon view-button just clicked.
    that.results.setActiveDataView(clickedViewId)

    // Update view according to model.
    that.view.setActiveDataView(that.results.getActiveDataView())
    that.view.createPageBody("results")
  }
  return innerFunction
}
