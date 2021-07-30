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
  m.setAttribute("role", "button")
  m.setAttribute("aria-expanded", "false")
  let iconEl = document.createElement("i")
  iconEl.classList.add("material-icons")
  iconEl.innerHTML = "menu"
  m.appendChild(iconEl)
  return m
}

View.prototype.createMenuDrawer = function(menuTitle, menuItemsArray=[]) {
  let title = (!menuTitle) ? this.getMenuTitle() : menuTitle
  let md = document.createElement("span")
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

  // TODO: DRY this up with a map lambda.

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
  let enableCacheClear = this.hasPersistedSettings() ? "" : "disabled='disabled'"

  // TODO:  Implement hasNonDefaultSettings() method which looks at runtime state
  //        as opposed to persisted state.
  // let enableRestoreDefaults = this.hasNonDefaultSettings() ? "" : "disabled='disabled'"
  let enableRestoreDefaults = ""

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

  settingsMenuNode.innerHTML += "<li class='mdl-menu__item' style='margin-top: 1em; height: 2em; line-height: 1em' disabled><span id='settings-language-menu'>" + langString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item' style='height: 2em; line-height: 1em' disabled><span>" + countryString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item--full-bleed-divider' style='height: 2em; line-height: 1em' disabled><span id='settings-max-results-menu'>" + maxResultsString + "</span></li>"

  settingsMenuNode.innerHTML += `<li id='settings_restore_button' class='mdl-menu__item mdl-button'><i class='material-icons header-icons'>restore_page</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${settingsDefault}</span></li>`,
  settingsMenuNode.innerHTML += `<li id='settings_clearcache_button' class='mdl-menu__item mdl-button' ${enableCacheClear}><i class='material-icons header-icons'>clear</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>${settingsClear}</span></li>`,

  md.appendChild(settingsMenuNode)

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
