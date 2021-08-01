//----------------------------------------------------------------------------------
// Menu
//
// These view methods render the application's menu based upon the state of the 
// following models:
//
//    menu model
//    settings model
//
// State is fetched through getter methods passed into the view constructor.
//----------------------------------------------------------------------------------
// TODO: Allow the view to subscribe to model-state changes.  
//
//       Currently the controller shoulders responsibility for keeping the view 
//       synchronized with the models.  Eventually the view will include render()
//       methods that can be registered with and invoked by the models in response
//       to state changes therein.
//----------------------------------------------------------------------------------

View.prototype.createHamburgerMenu = function() {
  let m = document.createElement("div")
  m.classList.add("mdl-layout__drawer-button")
  m.setAttribute("id", "hamburger-menu")
  m.setAttribute("role", "button")
  m.setAttribute("aria-expanded", "false")
  let iconEl = document.createElement("i")
  iconEl.classList.add("material-icons")
  iconEl.innerHTML = "menu"
  m.appendChild(iconEl)
  return m
}

View.prototype.createMenuDrawer = function(menuTitle, menuItemsArray=[]) {

  //------------------------------------------------------------
  // MENU header
  //------------------------------------------------------------

  let title = (!menuTitle) ? this.getMenuTitle() : menuTitle
  let md = document.getElementById("menu-drawer")

  if (md) {
    // Remove any obsolete event handlers before we rebuild the menu drawer.
    this.removeChildNodes(md)
  } else {
    md = document.createElement("span")
    md.setAttribute("id", "menu-drawer")
  }

  md.classList.add("mdl-layout__drawer")
  let mdHeader = document.createElement("div")
  mdHeader.classList.add("mdl-layout__header-row")
  mdHeader.classList.add("mdl-layout-title")
  mdHeader.classList.add("mdl-menu__item--full-bleed-divider")
  mdHeader.innerHTML  = "<span>" + title + "</span>&nbsp;&nbsp;" 
  mdHeader.innerHTML += "<div class='mdl-layout-spacer'>"
  mdHeader.innerHTML += "<button id='dismiss_menu_button' class='mdl-button mdl-js-button mdl-button--icon'><i class='material-icons header-icons'>clear</i></button>"
  mdHeader.innerHTML += "</div>"
  md.appendChild(mdHeader)

  /*
  // create clickable links in nav
  let nav = document.createElement("nav")
  nav.classList.add("mdl-navigation")
  let invariantMenuHtml = invariantMenuItems.map(item => {
    let anchor = document.createElement("a")
    anchor.classList.add("mdl-navigation__link")
    anchor.setAttribute("href", "")
    anchor.innerHTML = `${item}`
    return anchor
  })
  invariantMenuHtml.map(html => {
    md.appendChild(html)
  })
  let menuHtml = menuItemsArray.map(item => {
    let anchor = document.createElement("a")
    anchor.classList.add("mdl-navigation__link")
    anchor.setAttribute("href", "")
    anchor.innerHTML = `${item}`
    return anchor
    // return `<a class="mdl-navigation__link" href="">${item}</a>`
  })
  menuHtml.map(html => {
    md.appendChild(html)
  })
  */

  //------------------------------------------------------------
  // VIEW
  //------------------------------------------------------------

  let viewMenuButton = "button"
  let viewMenuButtonNode = document.createElement(viewMenuButton)
  viewMenuButtonNode.setAttribute("id", "viewMenu")
  viewMenuButtonNode.setAttribute("style", "text-align:left")
  viewMenuButtonNode.classList.add("mdl-button")
  viewMenuButtonNode.classList.add("mdl-js-button")
  let viewText = this.getMenuView()
  viewMenuButtonNode.innerHTML = `<i class='material-icons header-icons'>visibility</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>${viewText} ...</span>`
  md.appendChild(viewMenuButtonNode)
  let viewMenuHtml = "ul"
  let viewMenuNode = document.createElement(viewMenuHtml)
  viewMenuNode.classList.add("mdl-menu")
  viewMenuNode.classList.add("mdl-js-menu")
  viewMenuNode.classList.add("mdl-menu--bottom-right")
  viewMenuNode.setAttribute("for", "viewMenu")
  let viewIntro = this.getMenuViewIntro()
  let viewPriorities = this.getMenuViewPriorities()
  let viewBestBets = this.getMenuViewBestBets()
  let viewBlog = this.getMenuViewBlog()

  viewMenuNode.innerHTML  = `<li id='view_landing_button' class='mdl-menu__item mdl-button'><i class='material-icons header-icons'>home</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${viewIntro}</span></li>`
  viewMenuNode.innerHTML += `<li id='view_priorities_button' class='mdl-menu__item mdl-button'><i class='material-icons header-icons'>tune</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${viewPriorities}</span></li>`
  viewMenuNode.innerHTML += `<li id='view_cities_button' class='mdl-menu__item mdl-button mdl-menu__item--full-bleed-divider'><i class='material-icons header-icons'>location_city</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${viewBestBets}</span></li>`

  viewMenuNode.innerHTML += `<li class='mdl-menu__item'><a href='${this.githubUrl}' target='_blank' ref='noreferrer noopener' title='blog'><i class='material-icons header-icons'>local_library</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${viewBlog}</span></a></li>`
  md.appendChild(viewMenuNode)

  //------------------------------------------------------------
  // PRIORITIES
  //------------------------------------------------------------

  let prioritiesMenuButton = "button"
  let prioritiesMenuButtonNode = document.createElement(prioritiesMenuButton)
  prioritiesMenuButtonNode.setAttribute("id", "prioritiesMenu")
  prioritiesMenuButtonNode.setAttribute("style", "text-align:left")
  prioritiesMenuButtonNode.classList.add("mdl-button")
  prioritiesMenuButtonNode.classList.add("mdl-js-button")
  let prioritiesText = this.getMenuPriorities() // TODO
  prioritiesMenuButtonNode.innerHTML = `<i class='material-icons header-icons'>tune</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>${prioritiesText} ...</span>`
  md.appendChild(prioritiesMenuButtonNode)
  let prioritiesMenuHtml = "ul"
  let prioritiesMenuNode = document.createElement(prioritiesMenuHtml)
  let prioritiesEnableCacheClear = this.hasPersistedPriorities() ? "" : "disabled='disabled'"

  // TODO:  Implement hasNonDefaultPriorities() method which looks at runtime state
  //        as opposed to persisted state.
  // let prioritiesEnableRestoreDefaults = this.hasNonDefaultPriorities() ? "" : "disabled='disabled'"
  let prioritiesEnableRestoreDefaults = ""

  prioritiesMenuNode.classList.add("mdl-menu")
  prioritiesMenuNode.classList.add("mdl-js-menu")
  prioritiesMenuNode.classList.add("mdl-menu--bottom-right")
  prioritiesMenuNode.setAttribute("for", "prioritiesMenu")

  let happinessString = this.getMenuPrioritiesFormattedHappiness() 
  let politicsString = this.getMenuPrioritiesFormattedPolitics()
  let costString = this.getMenuPrioritiesFormattedCost()

  let happinessEn = this.getMenuPrioritiesFormattedHappinessEn() 
  let politicsEn = this.getMenuPrioritiesFormattedPoliticsEn()
  let costEn = this.getMenuPrioritiesFormattedCostEn()


  prioritiesMenuNode.innerHTML = ""

  let prioritiesEdit = this.getMenuPrioritiesEdit()
  let prioritiesClear = this.getMenuPrioritiesClear()
  let prioritiesDefault = this.getMenuPrioritiesDefault()

  prioritiesMenuNode.innerHTML += `<li id='priorities_edit_button' class='mdl-menu__item mdl-button mdl-menu__item--full-bleed-divider'><i class='material-icons header-icons'>edit</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${prioritiesEdit} ...</span></li>`

  prioritiesMenuNode.innerHTML += `<li id='priorities-happiness-li' class='mdl-menu__item mdl-menu__item-noselect' style='margin-top: 1em; height: 1.75em; line-height: 1em' ${happinessEn}><span id='priorities-happiness-menu'>${happinessString}</span></li>`
  prioritiesMenuNode.innerHTML += `<li id='priorities-politics-li' class='mdl-menu__item mdl-menu__item-noselect' style='height: 1.75em; line-height: 1em' ${politicsEn}><span id='priorities-politics-menu'>${politicsString}</span></li>`
  prioritiesMenuNode.innerHTML += `<li id='priorities-cost-li' class='mdl-menu__item mdl-menu__item-noselect mdl-menu__item--full-bleed-divider' style='height: 1.75em; line-height: 1em' ${costEn}d><span id='priorities-cost-menu'>${costString}</span></li>`

  prioritiesMenuNode.innerHTML += `<li id='priorities_restore_button' class='mdl-menu__item mdl-button' ${prioritiesEnableRestoreDefaults}><i class='material-icons header-icons'>restore_page</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${prioritiesDefault}</span></li>`,
  prioritiesMenuNode.innerHTML += `<li id='priorities_clearcache_button' class='mdl-menu__item mdl-button' ${prioritiesEnableCacheClear}><i class='material-icons header-icons'>clear</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${prioritiesClear}</span></li>`,

  md.appendChild(prioritiesMenuNode)

  //------------------------------------------------------------
  // SETTINGS
  //------------------------------------------------------------

  let settingsMenuButton = "button"
  let settingsMenuButtonNode = document.createElement(settingsMenuButton)
  settingsMenuButtonNode.setAttribute("id", "settingsMenu")
  settingsMenuButtonNode.setAttribute("style", "text-align:left")
  settingsMenuButtonNode.classList.add("mdl-button")
  settingsMenuButtonNode.classList.add("mdl-js-button")
  let settingsText = this.getMenuSettings()
  settingsMenuButtonNode.innerHTML = `<i class='material-icons header-icons'>settings</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>${settingsText} ...</span>`
  md.appendChild(settingsMenuButtonNode)
  let settingsMenuHtml = "ul"
  let settingsMenuNode = document.createElement(settingsMenuHtml)
  let settingsEnableCacheClear = this.hasPersistedSettings() ? "" : "disabled='disabled'"

  // TODO:  Implement hasNonDefaultSettings() method which looks at runtime state
  //        as opposed to persisted state.
  // let settingsEnableRestoreDefaults = this.hasNonDefaultSettings() ? "" : "disabled='disabled'"
  let settingsEnableRestoreDefaults = ""

  settingsMenuNode.classList.add("mdl-menu")
  settingsMenuNode.classList.add("mdl-js-menu")
  settingsMenuNode.classList.add("mdl-menu--bottom-right")
  settingsMenuNode.setAttribute("for", "settingsMenu")
  let maxResultsString = this.getMenuSettingsShowTop(this.getMaxResults()) 
  let langString = this.getMenuSettingsUseLang(this.getLangName(this.getLocale()))
  let countryString = this.getMenuSettingsShowCities(this.getCountryName(this.getCountryCode()))

  settingsMenuNode.innerHTML = ""

  let settingsEdit = this.getMenuSettingsEdit()
  let settingsClear = this.getMenuSettingsClear()
  let settingsDefault = this.getMenuSettingsDefault()

  settingsMenuNode.innerHTML += `<li id='settings_edit_button' class='mdl-menu__item mdl-button mdl-menu__item--full-bleed-divider'><i class='material-icons header-icons'>edit</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${settingsEdit} ...</span></li>`

  settingsMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item-noselect' style='margin-top: 1em; height: 1.75em; line-height: 1em'><span id='settings-language-menu'>" + langString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item-noselect' style='height: 1.75em; line-height: 1em'><span>" + countryString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item-noselect mdl-menu__item--full-bleed-divider' style='height: 1.75em; line-height: 1em'><span id='settings-max-results-menu'>" + maxResultsString + "</span></li>"

  settingsMenuNode.innerHTML += `<li id='settings_restore_button' class='mdl-menu__item mdl-button' ${settingsEnableRestoreDefaults}><i class='material-icons header-icons'>restore_page</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${settingsDefault}</span></li>`,
  settingsMenuNode.innerHTML += `<li id='settings_clearcache_button' class='mdl-menu__item mdl-button' ${settingsEnableCacheClear}><i class='material-icons header-icons'>clear</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${settingsClear}</span></li>`,

  md.appendChild(settingsMenuNode)

  //------------------------------------------------------------
  // HELP
  //------------------------------------------------------------

  let helpMenuButton = "button"
  let helpMenuButtonNode = document.createElement(helpMenuButton)
  helpMenuButtonNode.setAttribute("id", "helpMenu")
  helpMenuButtonNode.setAttribute("style", "text-align:left")
  helpMenuButtonNode.setAttribute("disabled", "disabled")
  helpMenuButtonNode.classList.add("mdl-button")
  helpMenuButtonNode.classList.add("mdl-js-button")
  let helpText = this.getMenuSettingsHelp()
  helpMenuButtonNode.innerHTML = `<i class='material-icons header-icons'>help</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>${helpText}</span>`
  md.appendChild(helpMenuButtonNode)

  return md
}

View.prototype.getMenuPrioritiesFormattedHappiness = function() {
  let happinessValue = this.getHappinessValue()
  let quartile = this.getSketchyQuartile("happiness", happinessValue)
  let emojiIcon = ''
  switch (quartile) {
    case 1:
      emojiIcon = 'fa-meh-rolling-eyes'  // 8|
      break
    case 2:
      emojiIcon = 'fa-meh'         // :|
      break
    case 3:
      emojiIcon = 'fa-smile'       // :)
      break
    case 4:
      emojiIcon = 'fa-grin-beam'   // :D
      break
    default:
      emojiIcon = 'fa-meh-blank'
  }
  let emoji = `<i class="far ${emojiIcon} fa-sm black-text pr-3" aria-hidden="true"></i>`
  let happinessFormattedString = `&nbsp;${emoji}&nbsp;${happinessValue}` 
  let happinessString = this.getMenuPrioritiesHappiness(happinessFormattedString)
  return happinessString
}

View.prototype.getMenuPrioritiesFormattedHappinessEn = function() {
  let happinessEn = this.getHappinessEnabled() ? "" : "disabled"
  return happinessEn
}

View.prototype.getMenuPrioritiesFormattedPolitics = function() {
  let politicsValue = this.getPoliticsValue()
  let donkey = '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>'
  let elephant = '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>'
  let politicsFormattedString = `&nbsp;${donkey}&nbsp;${politicsValue.dem16_frac}%&nbsp;&nbsp; ${elephant}&nbsp;${politicsValue.rep16_frac}%`
  let politicsString = this.getMenuPrioritiesPolitics(politicsFormattedString)
  return politicsString
}

View.prototype.getMenuPrioritiesFormattedPoliticsEn = function() {
  let politicsEn = this.getPoliticsEnabled() ? "" : "disabled"
  return politicsEn
}

View.prototype.getMenuPrioritiesFormattedCost = function() {
  let house = '<i class="fas fa-home fa-sm black-text pr-3" aria-hidden="true"></i>'
  let costString = this.getMenuPrioritiesCost(`&nbsp;${house}&nbsp;${this.formatter.format(this.getAffordabilityValue())}`)
  return costString
}

View.prototype.getMenuPrioritiesFormattedCostEn = function() {
  let costEn = this.getAffordabilityEnabled() ? "" : "disabled"
  return costEn
}

// Refresh priorty-related values in the menu view
// with current state.
//
// TODO: This should just observe the priorities model ... one day soon.

View.prototype.renderMenuPriorities = function() {
  let happinessString = this.getMenuPrioritiesFormattedHappiness()
  let politicsString = this.getMenuPrioritiesFormattedPolitics()
  let costString = this.getMenuPrioritiesFormattedCost()

  let hEl = document.getElementById('priorities-happiness-menu')
  hEl.innerHTML = happinessString

  let pEl = document.getElementById('priorities-politics-menu')
  pEl.innerHTML = politicsString

  let aEl = document.getElementById('priorities-cost-menu')
  aEl.innerHTML = costString

  
  let hEn = document.getElementById('priorities-happiness-li')
  let hEnAttr = this.getMenuPrioritiesFormattedHappinessEn()
  if (hEnAttr) {
    hEn.setAttribute("disabled", "disabled")
  } else {
    hEn.removeAttribute("disabled")
  }

  let pEn = document.getElementById('priorities-politics-li')
  let pEnAttr = this.getMenuPrioritiesFormattedPoliticsEn()
  if (pEnAttr) {
    pEn.setAttribute("disabled", "disabled")
  } else {
    pEn.removeAttribute("disabled")
  }

  let aEn = document.getElementById('priorities-cost-li')
  let aEnAttr = this.getMenuPrioritiesFormattedCostEn()
  if (aEnAttr) {
    aEn.setAttribute("disabled", "disabled")
  } else {
    aEn.removeAttribute("disabled")
  }
}
