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
  {
    id: 'nav-lang-button',
    icon: 'language',
    tooltip: (self) => {return self.getSelectLangTooltip()},
    enabled: false,
    html: (self, id, icon = 'warning', tooltip = '', disabled = '') => {
      let tooltipText = (typeof tooltip === 'function') ? tooltip(self) : tooltip
      let tooltipHTML = `<i class="header__nav-item material-icons">${icon}</i>${tooltipText}`
      return self.getNavLangDropdown(self.getLangFlagListItems(self.getLangOptionsMap()), tooltipHTML)
    }
  },
  {
    id: 'nav-acct-button',
    icon: 'account_circle',
    tooltip: 'login',
    enabled: false,
    html: (self, id, icon = 'warning', tooltip = '', disabled = '') => {
      return `<button id="${id}"
                      class="header__nav-item material-icons  mdl-navigation__link mdl-button mdl-js-button mdl-button--icon"
                      ${disabled}>
                  <i class="material-icons">
                    ${icon}
                  </i>
              </button>
              <div class="mdl-tooltip" for="${id}">${tooltip}</div>`
    }
  }
]

View.prototype.dfltSubnavPropsArray = [
  {
    id: '',
    icon: 'space_bar',
    tooltip: '',
    enabled: false
  },
  {
    id: '',
    icon: 'space_bar',
    tooltip: '',
    enabled: false
  }
]

View.prototype.createNav = function(propsArray = this.dfltNavPropsArray) {
  let innerHTML = propsArray.map((item) => {
      let disabled = (!item.enabled || item.enabled === false) ? "disabled='disabled'" : ""
      let html = (typeof item.html === 'function')
                    ? item.html(this, item.id, item.icon, item.tooltip, disabled)
                    : item.html
      return html
  }).join('')

  let html = `<nav class="header__nav">${innerHTML}</nav>`
  return html
}

View.prototype.createSubnav = function(propsArray = this.dfltSubnavPropsArray) {
  let innerHTML = propsArray.map((item) => {
      let navIcon = item.icon || 'space_bar'
      let html = `<span class="material-icons header__nav-item">${navIcon}</span>`
      return html
  }).join('')

  let html = `<nav class="header__nav subheader__nav">${innerHTML}</nav>`
  return html
}

View.prototype.createHeader = function(
          title,
          subTitle = "",
          navPropsArray = this.dfltNavPropsArray) {

  let h = document.createElement("header")
  h.setAttribute("id", "header-id")
  h.setAttribute("class", "header")

  let navHTML = this.createNav(navPropsArray)
  let subnavHTML = this.createSubnav(navPropsArray)

  h.innerHTML = `
        <section id="primary-header" class="mdl-layout__header header__row">
          <!-- MDL manages the hamburger button and associated click handler -->
          <!-- through classes.  Here, we're just adding an invisible icon   -->
          <!-- to influence layout of stuff to the right of the menu button. -->
          <span class="material-icons header__hidden-icon">space_bar</span>

          <span id="nav-title-text" class="header__title header__title-button mdl-button">
            ${title}
          </span>
          ${navHTML}
        </section>`

  if (subTitle) {
    h.innerHTML += `
        <section id="secondary-header" class="header__row subheader__row">
          <!-- Adding spacer icons to keep subtitle aligned with title text  -->
          <!-- in primary header.                                            -->
          <span class="material-icons header__menu-icon subheader__menu-icon">
            space_bar
          </span>

          <span class="subheader__title">${subTitle}</span>
          ${subnavHTML}
        </section>`
  }

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

    let li = `<li style="margin: 0; width: 2em;" id="nav-language-${i+1}" data-val="${langKey}" data-value="${langKey}"
                  ${selected} ${disabled} class="mdl-menu__item">
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
