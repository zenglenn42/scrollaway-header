//----------------------------------------------------------------------------------
// Controller (for Priorities page)
//
// These methods define the event listeners associated with the priorities view.
//
// The event handlers typically cause the priorities model and view to be updated.
//
// In the priorities model, desired settings for civic happiness, affordability,
// and prevailing politics are updated in response to slider events.
//----------------------------------------------------------------------------------

Controller.prototype.getPrioritiesPageEventListeners = function() {
  return this.addPrioritiesPageEventListeners
}

Controller.prototype.addPrioritiesPageEventListeners = function() {
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
  }

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()

  this.addSlideSwitchClassEventListener()
  this.addSliderEventListeners()
}

Controller.prototype.addSlideSwitchClassEventListener = function() {
  var that = this
  this.delegatedHandlers.addEventListener(document, "click", ".mdl-switch__input", function(e) {
    let imgColorFilter = ""
    let disabled = ""
    let switchId = this.getAttribute("id")
    if (that.switchIsEnabled(switchId)) {
      // Ignore the Job Outlook slide switch until I implement this feature.
      if (switchId == that.view.switchJobSearchId) {
        imgColorFilter = "grayscale(100%)" // make JobSearch img always gray for now.
        disabled = "disabled"
      } else {
        switch (switchId) {
          case that.view.switchHappinessId:
            that.priorities.setHappinessEnabled(true)
            break
          case that.view.switchAffordabilityId:
            that.priorities.setAffordabilityEnabled(true)
            break
          case that.view.switchPoliticsId:
            that.priorities.setPoliticsEnabled(true)
            break
          // case that.view.switchJobSearchId:
          //   that.priorities.setJobSearchEnabled(true)
          //   break
        }
        // console.log("checked")
        imgColorFilter = "grayscale(0%)" // make image colorful
        disabled = ""
      }
    } else {
      switch (switchId) {
        case that.view.switchHappinessId:
          that.priorities.setHappinessEnabled(false)
          break
        case that.view.switchAffordabilityId:
          that.priorities.setAffordabilityEnabled(false)
          break
        case that.view.switchPoliticsId:
          that.priorities.setPoliticsEnabled(false)
          break
        case that.view.switchJobSearchId:
          that.priorities.setJobSearchEnabled(false)
          break
      }
      // console.log("not checked")
      imgColorFilter = "grayscale(100%)" // make image black & white
      disabled = "disabled"
    }
    that.cache.setPriorities(that.priorities.get())

    // TODO: Fragile!  Walk DOM subtree and find childNode with
    //       class == ".mdl-card_title"
    let imgDiv = this.parentNode.parentNode.parentNode.childNodes[1]
    imgDiv.style.filter = imgColorFilter

    // Enable/disable the corresponding slider in sync with the
    // enable/disable state of the switch.
    //
    // TODO: Make creation of sliderId more robust.

    let sliderId = switchId.replace("switch", "slider")
    let sliderEl = document.getElementById(sliderId)
    if (sliderEl && disabled) {
      sliderEl.removeAttribute("disabled")
      sliderEl.setAttribute("disabled", "disabled")
    } else if (sliderEl && !disabled) {
      sliderEl.removeAttribute("disabled")
    }
  })
}

Controller.prototype.addSliderEventListeners = function() {
  let sliderH = document.getElementById(this.view.sliderHappinessId)
  let sliderHSel = `#${this.view.sliderHappinessId}`
  this.delegatedHandlers.addEventListener(
      document,
      "change",
      sliderHSel,
      (e) => {
        let value = e.target.value
        this.priorities.setHappinessValue(Number(value))
        this.cache.setPriorities(this.priorities.get())
      }
  )

  let sliderP = document.getElementById(this.view.sliderPoliticsId)
  let sliderPSel = `#${this.view.sliderPoliticsId}`
  this.delegatedHandlers.addEventListener(
      document,
      "change",
      sliderPSel,
      (e) => {
        let value = e.target.value
        let republicanVal = Number(value)
        let democratVal = 100 - republicanVal
        this.priorities.setPoliticsValue({rep16_frac: republicanVal, dem16_frac: democratVal})
        this.cache.setPriorities(this.priorities.get())
      }
  )

  let sliderA = document.getElementById(this.view.sliderAffordabilityId)
  let sliderASel = `#${this.view.sliderAffordabilityId}`
  this.delegatedHandlers.addEventListener(
      document,
      "change",
      sliderASel,
      (e) => {
        let value = e.target.value
        this.priorities.setAffordabilityValue(Number(value))
        this.cache.setPriorities(this.priorities.get())
      }
  )
}

Controller.prototype.switchIsEnabled = function(switchId) {
  return document.getElementById(switchId).checked == true
}
