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
      let useCapture = true // Otherwise precedence is given to the low-level tab component
                            // event handler and focus may shift to a disabled view-button.
                            //
                            // We want the latitude to pre-empt the flow of events to 3rd-party
                            // components that don't understand our high-level visualization
                            // policy.

      el.addEventListener("click", this.getViewButtonEventListener(), useCapture)
    }
  }

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}

Controller.prototype.getViewButtonEventListener = function() {
  let that = this
  function innerFunction(e) {
    let requestedView = this.getAttribute("id")
    let currentView = that.results.getActiveDataView()

    if (requestedView !== currentView && !requestedView.endsWith("disabled")) {
      // Update model based upon view-button just clicked.
      that.results.setActiveDataView(requestedView)

      // Update view according to model.
      that.view.setActiveDataView(that.results.getActiveDataView())
      that.view.createPageBody("results")
    } else {
      e.stopPropagation() // Otherwise event will propagate down to tab component and
                          // draw focus to disabled view-button.
      e.preventDefault()  // Otherwise index.html#map-button shows up as location in browser.
    }
  }
  return innerFunction
}
