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
  nextButton = document.getElementById("navigate_next")
  nextPageAttr = nextButton.getAttribute("data-nextpage") || "landing"

  switch(nextPageAttr) {
    case "priorities":
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createPrioritiesBody.bind(this.view))
      )
      break

    case "results":
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createResultsBody.bind(this.view))
      )
      break

    case "landing":
    default:
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createLandingBody.bind(this.view))
      )
      break
  }

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
             //this.settings.saveLocalState()
             this.view.setMaxResults() // set view based upon model
                                       // TODO: This should go away once
                                       // observer pattern is implemented
                                       // in the model.
           }
           // console.log(`click show top ${value} cities`)
     })
  })

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()
}
