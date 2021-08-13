//----------------------------------------------------------------------------------
// Header
//
// These view methods render the application's header based upon the state of the
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

View.prototype.dfltNavPropsArray = [
        {id: 'nav-lang-button', icon: 'language',       tooltip: '<i class="material-icons header-icons">language</i>Select language / locale', enabled: false},
        {id: 'nav-acct-button', icon: 'account_circle', tooltip: 'login',    enabled: false}]

View.prototype.createNav = function(navPropsArray = this.dfltNavPropsArray) {
  let navInnerHtml = navPropsArray.map((navItem) => {
    let navItemId = navItem.id
    let navIcon = navItem.icon || 'warning'
    let disabled = (!navItem.enabled || navItem.enabled === false) ? "disabled" : ""
    let html = ''
    if (navItemId === 'nav-lang-button') {
      let langListItems = this.getLangFlagListItems(this.getLangOptionsMap())
      html = this.getNavLangDropdown(langListItems, navItem.tooltip)
    } else {
      html = `
          <button id="${navItemId}" 
                  class="mdl-navigation__link mdl-button mdl-js-button mdl-button--icon"
                  ${disabled} >
            <i class='material-icons header-icons'>${navIcon}</i>
          </button>
          <div class="mdl-tooltip" for="${navItemId}">${navItem.tooltip}</div>
      `
    }
    return html
  }).join('')
  let navHtml = `<nav class="mdl-navigation">${navInnerHtml}</nav>`
  return navHtml
}

// TODO: Add ability to make the subTitle disappear
//       especially on mobile when swiping up to view content below.
//       Screen real estate is too previous on small devices to give
//       preference to a fixed header instead of city results, for example.

View.prototype.createHeader = function(title, subTitle = "", navPropsArray = this.dfltNavPropsArray) {
  let h = document.createElement("header")
  let navHtml = this.createNav(navPropsArray)
  let centerBelowTitle = "&nbsp".repeat(0)  // Slightly more pleasing subTitle centering. TODO: Do this in CSS.
  let subTitleHtml = (subTitle) 
                    ? `<section style="padding: 0.25em 0; background-color: gray; text-align: center">
                          ${centerBelowTitle}${subTitle}
                       </section>`
                    : ''

  h.classList += "mdl-layout__header"
  h.innerHTML = `
      <div class="mdl-layout__header-row">
      <div class="mdl-layout__header-left-spacer"></div>
      <div class="mdl-layout-spacer"></div>
      <span id="nav-title-text" 
            class="mdl-layout-title mdl-button" 
            style="color:white; text-transform: none; padding-top: 8px;">
          ${title}
      </span>
      <div class="mdl-layout-spacer"></div>
      ${navHtml}
      </div>
      ${subTitleHtml}
    `
  let hamburgerMenu = this.createHamburgerMenu()
  h.appendChild(hamburgerMenu)

  return h
}

View.prototype.getLangFlagListItems = function(langMap) {
  let langFlagListItems = Object.keys(langMap).reduce((acc, langKey, i) => {
    let name = langMap[langKey].name
    let flag = langMap[langKey].flag
    let supported = langMap[langKey].supported
    let currentKey = this.getLocale()
    let selected = (currentKey === langKey) ? `data-selected="true"` : ''
    let disabled = ""

    // Snip this feature out while integrating getmdl-select.
    // if (!supported) {
    //   disabled="disabled"
    // }

    let li = `<li style="margin: 0; width: 2em;" id="nav-language-${i+1}" data-val="${langKey}" data-value="${langKey}" ${selected} ${disabled}
                  class="mdl-menu__item">
                  ${flag}
              </li>`
    acc += li
    return acc
  }, "")
  return langFlagListItems
}

View.prototype.getNavLangDropdown = function(langListItems, tooltip) {
  let html = `
      <span id="dropdown-nav-language"
           class="mdl-textfield mdl-js-textfield
                  getmdl-select getmdl-select__fix-height getmdl-select_fix-width settings-textfield">
        <input id="nav-language"
            type="text" value=""
            class="mdl-textfield__input"
            style="width: 24px; height: 24px; border-style: hidden; vertical-align: middle"
            readonly>
        <input type="hidden" value="" name="nav-language"/>
        <label class="mdl-textfield__label"
              for="nav-language"
              style="color: black;">
          <i class="material-icons header-icons">language</i>
        </label>
        <ul style="width: 2em; min-width: 4em; text-align: center;" for="nav-language"
            class="mdl-menu mdl-menu--bottom-right mdl-js-menu">
            ${langListItems}
        </ul>
        <div class="mdl-tooltip mdl-tooltip--left" for="nav-language">${tooltip}</div>
      </span>
      `
  return html
}
