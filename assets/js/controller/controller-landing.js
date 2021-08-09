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
  let homeTitleEl = document.getElementById("nav-title-text")
  if (homeTitleEl) {
    this.delegatedHandlers.addEventListener(document, "click", "#nav-title-text", (e) => {
        this.FAB.set({pageState: "dontcare_landing"})
        this.cache.setFAB(this.FAB.get())
        this.view.createPageBody("landing")
      }
    )
  }

  let fabEl = this.view.getFAB()
  if (fabEl) {
    fabEl.addEventListener(
      "click",
      this.getFabEventListener(
        this.view.createPageBody.bind(this.view)
      )
    )
    /*
    this.delegatedHandlers.addEventListener(
          document,
          "click",
          "#floating-access-button",
          this.getFabEventListener(this.view.createPageBody.bind(this.view))
    )
    */
  }

  // Make hamburger menu responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
