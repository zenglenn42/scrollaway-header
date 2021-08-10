//----------------------------------------------------------------------------------
// Priorities Page
//
// These view methods update the browser DOM to render the 'Share your priorities'
// screen.
//----------------------------------------------------------------------------------

View.prototype.switchHappinessId = "switch-happiness"
View.prototype.sliderHappinessId = "slider-happiness"
View.prototype.tooltipHappinessId = "tooltip-happiness"

View.prototype.switchPoliticsId = "switch-politics"
View.prototype.sliderPoliticsId = "slider-politics"
View.prototype.tooltipPoliticsId = "tooltip-politics"

View.prototype.switchAffordabilityId = "switch-affordability"
View.prototype.sliderAffordabilityId = "slider-affordability"
View.prototype.tooltipAffordabilityId = "tooltip-affordability"

View.prototype.switchJobSearchId = "switch-jobsearch"
View.prototype.tooltipJobSearchId = "tooltip-jobsearch"

View.prototype.createPrioritiesBody = function createPrioritiesBody() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  this.removeChildNodes(bodyDiv)
  let title = this.getAppName()
  let subTitle  = this.getPrioritiesTitle()
  let header = this.createHeader(title, [
        {id: 'nav-lang-button', icon: 'language',       tooltip: 'language', enabled: false},
        {id: 'nav-acct-button', icon: 'account_circle', tooltip: 'login',    enabled: false}],
        subTitle)
  let menuDrawer = this.createMenuDrawer()
  this.addMenuDrawerEventListeners()
  let hamburgerMenu = this.createHamburgerMenu()
  let mainPriorities = this.createPrioritiesMain()
  let footer = this.createFooter()

  this.addHeader(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainPriorities)
  bodyDiv.appendChild(footer)

  this.addPrioritiesPageEventListeners()
}

View.prototype.createPrioritiesMain = function() {
  let m = document.createElement("main")
  m.setAttribute("id", "main")
  m.classList.add("maxy-main")
  let child = document.createElement("div")
  child.classList.add("grid-content")
  m.appendChild(child)
  let g = document.createElement("div")
  g.classList.add("mdl-grid")
  m.appendChild(g)

  let happinessTitle = this.getPrioritiesHappinessTitle()
  let happinessTooltip = this.getPrioritiesHappinessTooltip()
  let priorityParams = {
    img: "assets/img/civic-happiness-sf.jpg",
    titleText: happinessTitle,
    id: "happiness",
    switchId: `${this.switchHappinessId}`,
    sliderId: `${this.sliderHappinessId}`,
    sliderContainerId: `${this.sliderHappinessId}-container`,
    tooltipId: `${this.tooltipHappinessId}`,
    tooltipIcon: 'info',
    iconClass: "far fa-lg pr-3",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: this.minHappinessValue,
    maxSliderVal: this.maxHappinessValue,
    curSliderVal: this.getHappinessValue(),
    sliderEnabled: this.getHappinessEnabled(),
    priorityLink: "",
    tooltipText: happinessTooltip
  }
  let c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  let politicsTitle = this.getPrioritiesPoliticsTitle()
  let politicsTooltip = this.getPrioritiesPoliticsTooltip()
  let curPoliticsVal = this.getPoliticsValue().rep16_frac
  priorityParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: politicsTitle,
    switchId: `${this.switchPoliticsId}`,
    sliderId: `${this.sliderPoliticsId}`,
    sliderContainerId: `${this.sliderPoliticsId}-container`,
    tooltipId: `${this.tooltipPolitics}`,
    tooltipIcon: 'info',
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: this.minPoliticsValue,
    maxSliderVal: this.maxPoliticsValue,
    curSliderVal: curPoliticsVal,
    sliderEnabled: this.getPoliticsEnabled(),
    priorityLink: "",
    tooltipText: politicsTooltip
  }
  c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  let affordabilityTitle = this.getPrioritiesAffordabilityTitle()
  let affordabilityTooltip = this.getPrioritiesAffordabilityTooltip()
  priorityParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: affordabilityTitle,
    switchId: `${this.switchAffordabilityId}`,
    sliderId: `${this.sliderAffordabilityId}`,
    sliderContainerId: `${this.sliderAffordabilityId}-container`,
    tooltipId: `${this.tooltipAffordabilityId}`,
    tooltipIcon: 'info',
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: this.minAffordabilityValue,
    maxSliderVal: this.maxAffordabilityValue,
    curSliderVal: this.getAffordabilityValue(),
    sliderEnabled: this.getAffordabilityEnabled(),
    priorityLink: "",
    tooltipText: affordabilityTooltip
  }
  c = this.createPrioritiesSliderCard(priorityParams)
  g.appendChild(c)

  let jobSearchTitle = this.getPrioritiesJobSearchTitle()
  let jobSearchTooltip = this.getPrioritiesJobSearchTooltip()
  let jobSearchPlaceholder = this.getPrioritiesJobSearchPlaceholder()
  priorityParams = {
    img: "assets/img/job-search.jpg",
    switchId: `${this.switchJobSearchId}`,
    inputId: "input-jobsearch",
    tooltipId: `${this.tooltipJobSearchId}`,
    tooltipIcon: 'lock',
    titleText: jobSearchTitle,
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeholderText: jobSearchPlaceholder,
    sliderEnabled: this.getJobSearchEnabled(),
    priorityLink: "",
    tooltipText: jobSearchTooltip
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
  let disabled = ""
  if (!priorityParams.sliderEnabled) {
    colorFilter = `filter: grayscale(100%);`
    disabled = "disabled"
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
            <i class="material-icons info-icon">${priorityParams.tooltipIcon}</i>
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
              ${disabled}
            />
            ${rightIconHTML}
          </div>
        </div>
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--medium mdl-tooltip--top" data-mdl-for=${tooltipId}>${priorityParams.tooltipText}</div>
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
            <i class="material-icons info-icon">${priorityParams.tooltipIcon}</i>
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
              placeholder="${priorityParams.placeholderText}"
              disabled
            />
          </div>
        </div>
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--medium mdl-tooltip--top" data-mdl-for=${tooltipId}>${priorityParams.tooltipText}</div>
      </div>
    `
  // Disable switch since job outlook feature not yet implemented.
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
