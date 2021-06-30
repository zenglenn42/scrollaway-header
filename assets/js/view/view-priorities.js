//----------------------------------------------------------------------------------
// Priorities Page
//
// These view methods update the browser DOM to render the 'Share your priorities'
// screen.
//----------------------------------------------------------------------------------
// TODO: Replace hardcoded presentation text with calls to (locale-sensitive)
//       model getter methods.
//
//       This will enable localization support.
//----------------------------------------------------------------------------------

View.prototype.switchHappinessId = "switch-happiness"
View.prototype.sliderHappinessId = "slider-happiness"
View.prototype.tooltipHappinessId = "tooltip-happiness"

View.prototype.switchPoliticsId = "switch-political-affiliation"
View.prototype.sliderPoliticsId = "slider-politics"
View.prototype.tooltipPoliticsId = "tooltip-politics"

View.prototype.switchAffordabilityId = "switch-affordability"
View.prototype.sliderAffordabilityId = "slider-affordability"
View.prototype.tooltipAffordabilityId = "tooltip-affordability"

View.prototype.switchJobSearchId = "switch-jobsearch"
View.prototype.tooltipJobSearchId = "tooltip-jobsearch"

View.prototype.createPrioritiesBody = function createPrioritiesBody() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  bodyDiv.innerHTML = ""
  let header = this.createHeader(
        "Share your priorities ...", "search")
  let menuDrawer = this.createMenuDrawer()
  let hamburgerMenu = this.createHamburgerMenu()
  let mainPriorities = this.createPrioritiesMain()
  let footer = this.createFooter()

  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainPriorities)
  bodyDiv.appendChild(footer)

  this.addPrioritiesPageEventListeners()
}

View.prototype.createPrioritiesMain = function() {
  let m = document.createElement("main")
  m.setAttribute("id", "main")
  m.classList.add("mdl-layout__content")
  m.setAttribute("data-currpage", "priorities")
  let child = document.createElement("div")
  child.classList.add("grid-content")
  m.appendChild(child)
  let g = document.createElement("div")
  g.classList.add("mdl-grid")
  m.appendChild(g)

  let priorityParams = {
    img: "assets/img/civic-happiness-sf.jpg",
    titleText: "Civic Happiness",
    id: "happiness",
    switchId: `${this.switchHappinessId}`,
    sliderId: `${this.sliderHappinessId}`,
    sliderContainerId: `${this.sliderHappinessId}-container`,
    tooltipId: `${this.tooltipHappinessId}`,
    iconClass: "far fa-lg pr-3",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: this.minHappinessValue,
    maxSliderVal: this.maxHappinessValue,
    curSliderVal: this.getHappinessValue(),
    sliderEnabled: this.getHappinessEnabled(),
    priorityLink: "",
    tooltipText: "Use slider below to adjust this priority.  Based upon a 2019 study by WalletHub across dimensions including overall well-being, employment, and community."
  }
  let c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  let curPoliticsVal = this.getPoliticsValue().rep16_frac
  priorityParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Prevailing Politics",
    switchId: `${this.switchPoliticsId}`,
    sliderId: `${this.sliderPoliticsId}`,
    sliderContainerId: `${this.sliderPoliticsId}-container`,
    tooltipId: `${this.tooltipPolitics}`,
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: this.minPoliticsValue,
    maxSliderVal: this.maxPoliticsValue,
    curSliderVal: curPoliticsVal,
    sliderEnabled: this.getPoliticsEnabled(),
    priorityLink: "",
    tooltipText: "Use slider below to adjust this priority of desired prevailing political environment.  Based upon county-level 2016 Presidential election data published by opendatasoft."
  }
  c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  priorityParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Cost of Living",
    switchId: `${this.switchAffordabilityId}`,
    sliderId: `${this.sliderAffordabilityId}`,
    sliderContainerId: `${this.sliderAffordabilityId}-container`,
    tooltipId: `${this.tooltipAffordabilityId}`,
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: this.minAffordabilityValue,
    maxSliderVal: this.maxAffordabilityValue,
    curSliderVal: this.getAffordabilityValue(),
    sliderEnabled: this.getAffordabilityEnabled(),
    priorityLink: "",
    tooltipText: "Use slider below to specify desired relative cost of living.  Based upon 2017 median home price by county published by US Census."
  }
  c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  priorityParams = {
    img: "assets/img/job-search.jpg",
    switchId: `${this.switchJobSearchId}`,
    inputId: "input-jobsearch",
    tooltipId: `${this.tooltipJobSearchId}`,
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: this.getJobSearchEnabled(),
    priorityLink: "",
    tooltipText: "This feature is currently unavailable."
  }
  c = this.createPrioritiesTextinputCard(priorityParams)
  g.appendChild(c)

  return m
}

View.prototype.createPrioritiesSliderCard = function(priorityParams, isEnabled) {
  let p = document.createElement("div")

  if (priorityParams.titleText == "Cost of Living") {
    /* Hacky :-/ solution for getting double $$ on right side.      */
    /* Really, parameter icons should be array that I iterate over. */
    rightIconHTML = `
        <i class="${priorityParams.iconClass} ${priorityParams.rightSliderIcon}"
          aria-hidden="true">
        </i>
       <i class="${priorityParams.iconClass} ${priorityParams.rightSliderIcon}"
        aria-hidden="true">
       </i>
      `
  } else {
    rightIconHTML = `
        <i class="${priorityParams.iconClass} ${priorityParams.rightSliderIcon}"
        aria-hidden="true">
        </i>
      `
  }

  let colorFilter = ""
  if (!priorityParams.sliderEnabled) {
    colorFilter = `filter: grayscale(100%);`
  }

  p.classList.add("mdl-cell")
  p.classList.add("priority-cell")
  p.classList.add("mdl-cell--3-col")
  let tooltipId = `${priorityParams.tooltipId}`
  p.innerHTML = `
      <div class="priority-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${priorityParams.img}') top/cover; ${colorFilter}"
        >
          <h2
            id=${tooltipId}
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
          >
            ${priorityParams.titleText} &nbsp;
            <i class="material-icons info-icon">info</i>
          </h2>
        </div>
        <div class="mdl-card__supporting-text">
          <div id=${priorityParams.sliderContainerId} class="mdl-slider__container">
            <i class="${priorityParams.iconClass} ${priorityParams.leftSliderIcon}"
              aria-hidden="true">
            </i>
            <input
              id=${priorityParams.sliderId}
              class="enhanced-slider mdl-slider mdl-js-slider"
              type="range"
              min=${priorityParams.minSliderVal}
              max=${priorityParams.maxSliderVal}
              value=${priorityParams.curSliderVal}
              tabindex="0"
            />
            ${rightIconHTML}
          </div>
        </div>
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" data-mdl-for=${tooltipId}>${priorityParams.tooltipText}</div>
      </div>
    `
  let mdlSwitch = this.createSlideSwitch(
    priorityParams.switchId,
    priorityParams.sliderEnabled
  )
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0]
  cardMenu.appendChild(mdlSwitch)
  return p
}

View.prototype.createSlideSwitch = function(id, isChecked) {
  let label = document.createElement("label")
  label.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect")
  label.setAttribute("for", id)

  let checkbox = this.createCheckbox(id, isChecked)
  checkbox.setAttribute("class", "mdl-switch__input")
  componentHandler.upgradeElement(checkbox)

  label.appendChild(checkbox)
  componentHandler.upgradeElement(label)
  return label
}

View.prototype.createCheckbox = function(id, isChecked) {
  let cb = document.createElement("input")
  cb.setAttribute("type", "checkbox")
  cb.setAttribute("id", id)
  if (isChecked) {
    cb.setAttribute("checked", "")
  }
  return cb
}

View.prototype.createPrioritiesTextinputCard = function(priorityParams) {
  let p = document.createElement("div")

  let colorFilterStyle = ""
  if (priorityParams.sliderEnabled) {
    colorFilter = `filter: grayscale(0%);`
  } else {
    colorFilter = `filter: grayscale(100%);`
  }

  p.classList.add("mdl-cell")
  p.classList.add("priority-cell")
  p.classList.add("mdl-cell--3-col")
  let tooltipId = `${priorityParams.tooltipId}`
  p.innerHTML = `
      <div class="priority-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${priorityParams.img}') top/cover; ${colorFilter}"
        >
          <h2
            id=${tooltipId}
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
          >
            ${priorityParams.titleText} &nbsp;
            <i class="material-icons info-icon">info</i>
          </h2>
        </div>
        <div class="mdl-card__supporting-text">
          <div class="md-form">
            <i class="${priorityParams.iconClass} ${priorityParams.icon}"
              aria-hidden="true">
            </i>
            <input
              type="text"
              id="${priorityParams.inputId}"
              class="form-control"
              placeholder="Job Title (disabled)"
              disabled
            />
          </div>
        </div>
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" data-mdl-for=${tooltipId}>${priorityParams.tooltipText}</div>
      </div>
    `
  /* Disable switch since job outlook feature not yet implemented. */
  /*
  let mdlSwitch = this.createSlideSwitch(
    priorityParams.switchId,
    priorityParams.sliderEnabled
  )
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0]
  cardMenu.appendChild(mdlSwitch)
  */
  return p
}
