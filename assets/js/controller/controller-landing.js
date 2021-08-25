//----------------------------------------------------------------------------------
// Controller (for Landing page)
//
// These methods define the event listeners associated with the landing page.
//
// In this case, a click of the floating access button (>) triggers the
// priorities page to be rendered.
//----------------------------------------------------------------------------------

Controller.prototype.getLandingPageEventListeners = function() {
  return this.addLandingPageEventListeners
}

Controller.prototype.addLandingPageEventListeners = function() {
  let fabEl = this.view.getFAB()
  if (fabEl) {
    this.delegatedHandlers.addEventListener(
          document,
          "click",
          "#floating-access-button",
          this.getFabEventListener(this.view.createPageBody.bind(this.view))
    )
  }

  // Render hamburger menu and make responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
