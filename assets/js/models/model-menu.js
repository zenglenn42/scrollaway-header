//----------------------------------------------------------------------------------
// ModelMenu
//
// This class maintains presentational attributes related to the application's menu.
//----------------------------------------------------------------------------------
// TODO: Consider making this model an observer of the settings model if that is
//       patternful ... since the menu does present some settings state.
//       Then the view would only have one view-model to subscribe to: the
//       menu model.  Alternative is to have view subscribe to disjoint menu
//       and settings models.
//----------------------------------------------------------------------------------

function ModelMenu(getLocale = () => {return "en-US"}) {
  if (!getLocale || typeof getLocale !== 'function') {
    throw('ModelMenu: Failed constructor.  Invalid getLocale fn parameter')
  }
  this.getLocale = getLocale
  this.dfltLocale = "en-US"

  this.msgCatalog = {
    "en-US": {
      title: "Menu",
      view: "View",
      viewIntro: "1. Introduction",
      viewPriorities: "2. Your priorities",
      viewBestBets: "3. Your best bets",
      viewBlog: "Blog",
      settings: "Settings",
      settingsEdit: "Edit",
      settingsClear: "Clear cached settings",
      useLang: "Use %s",
      showCities: "Show cities in %s",
      showTop: "Show top %d cities",
      help: "Help"
    },
    "hi-IN": {
      title: "मेनू",
      view: "इधर देखो",
      viewIntro: "1. परिचय",
      viewPriorities: "2. आपकी प्राथमिकताएं",
      viewBestBets: "3. आपका सबसे अच्छा दांव",
      viewBlog: "ब्लॉग",
      settings: "सेटिंग्स",
      settingsEdit: "आधुनिकीकरणअ",
      settingsClear: "कैश हटाएं",
      useLang: "प्रयोग %s",
      showCities: "के लिए शहरों दिखाएं %s",
      showTop: "सर्वश्रेष्ठ %d शहरों को दिखाएं",
      help: "मदद"
    },
    "es-ES": {
      title: "Menú",
      view: "Mira",
      viewIntro: "1. Introducción",
      viewPriorities: "2. Tus prioridades",
      viewBestBets: "3. Tus mejores apuestas",
      viewBlog: "Blog",
      settings: "Ajustes",
      settingsEdit: "Editar",
      settingsClear: "Limpiar cache",
      useLang: "Usar %s",
      showCities: "Mostrar ciudades en %s",
      showTop: "Mostrar las %d mejores ciudades",
      help: "Ayúdame"
    },
    "zh-CN": {
      title: "菜单",
      view: "看",
      viewIntro: "1. 简介",
      viewPriorities: "2. 你的优先事项",
      viewBestBets: "3. 你最好的城市",
      viewBlog: "博客",
      settings: "设置",
      settingsEdit: "编辑",
      settingsClear: "清除缓存",
      useLang: "使用 %s",
      showCities: "从这里显示城市 %s",
      showTop: "Show top %d cities",
      showTop: "显示最好的 %d 个城市",
      help: "协助"
    }
  }
}

ModelMenu.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" || locale === "hi-IN" || locale === "es-ES" || locale === "zh-CN")
}

ModelMenu.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelMenu.prototype.getMenuTitle = function() {
  let result = "missing_title"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'title')) {
    result = this.msgCatalog[locale].title
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'title')) {
    result = this.msgCatalog[this.dfltLocale].title
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuTitle() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuView = function() {
  let result = "missing_view"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'view')) {
    result = this.msgCatalog[locale].view
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'view')) {
    result = this.msgCatalog[this.dfltLocale].view
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuView() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewIntro = function() {
  let result = "missing_view_intro"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'viewIntro')) {
    result = this.msgCatalog[locale].viewIntro
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewIntro')) {
    result = this.msgCatalog[this.dfltLocale].viewIntro
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuViewIntro() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewPriorities = function() {
  let result = "missing_view_priorities"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'viewPriorities')) {
    result = this.msgCatalog[locale].viewPriorities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewPriorities')) {
    result = this.msgCatalog[this.dfltLocale].viewPriorities
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuViewPriorities() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewBestBets = function() {
  let result = "missing_view_bestbets"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'viewBestBets')) {
    result = this.msgCatalog[locale].viewBestBets
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewBestBets')) {
    result = this.msgCatalog[this.dfltLocale].viewBestBets
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuViewBestBets() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewBlog = function() {
  let result = "missing_view_blog"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'viewBlog')) {
    result = this.msgCatalog[locale].viewBlog
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewBlog')) {
    result = this.msgCatalog[this.dfltLocale].viewBlog
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuViewBlog() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettings = function() {
  let result = "missing_settings"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'settings')) {
    result = this.msgCatalog[locale].settings
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'settings')) {
    result = this.msgCatalog[this.dfltLocale].settings
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettings() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettingsEdit = function() {
  let result = "missing_settings_edit"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'settingsEdit')) {
    result = this.msgCatalog[locale].settingsEdit
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'settingsEdit')) {
    result = this.msgCatalog[this.dfltLocale].settingsEdit
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsEdit() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettingsClear = function() {
  let result = "missing_settings_clear"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'settingsClear')) {
    result = this.msgCatalog[locale].settingsClear
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'settingsClear')) {
    result = this.msgCatalog[this.dfltLocale].settingsClear
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsClear() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettingsUseLang = function(lang = "missing_lang") {
  let result = "missing_settings_useLang"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'useLang')) {
    result = this.msgCatalog[locale].useLang
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'useLang')) {
    result = this.msgCatalog[this.dfltLocale].useLang
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsUseLang() Error ", result)
  }
  result = result.replace("%s", lang)
  return result
}

ModelMenu.prototype.getMenuSettingsShowCities = function(country = "missing_country") {
  let result = "missing_settings_showCities"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'showCities')) {
    result = this.msgCatalog[locale].showCities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showCities')) {
    result = this.msgCatalog[this.dfltLocale].showCities
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsShowCities() Error ", result)
  }
  result = result.replace("%s", country)
  return result
}

ModelMenu.prototype.getMenuSettingsShowTop = function(numCities) {
  let result = "missing_settings_showTop"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'showTop')) {
    result = this.msgCatalog[locale].showTop
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showTop')) {
    result = this.msgCatalog[this.dfltLocale].showTop
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsShowTop() Error ", result)
  }
  result = result.replace("%d", JSON.stringify(numCities))
  return result
}

ModelMenu.prototype.getMenuSettingsHelp = function() {
  let result = "missing_settings_help"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'help')) {
    result = this.msgCatalog[locale].help
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'help')) {
    result = this.msgCatalog[this.dfltLocale].help
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelMenu:getMenuSettingsHelp() Error ", result)
  }
  return result
}

//----------------------------------------------------------------------------------
// Unit Test
//----------------------------------------------------------------------------------

function mkFailMsg(codeUnderTest, failStr) {
  let failMsg = `  [fail] ${codeUnderTest} \n  ${failStr}`
  return failMsg
}

function mkPassMsg(codeUnderTest, iterations) {
  let passMsg = ` [pass] ${codeUnderTest}`
  if (iterations) {
    passMsg += ` (${iterations} iterations)`
  }
  return passMsg
}

function UnitTestModelMenu() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "model-menu.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')


  // Test #1
  try {
    let dfltMenuModel = new ModelMenu()
    cut = "ModelMenu() dflt constructor"
    console.log(' Verifying default construction when ctor called without params ...')

    if (dfltMenuModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + dfltMenuModel.getLocale()
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #2
  try {
    failure = ""
    let nrmlMenuModel = new ModelMenu(() => {return "en-US"})
    cut = "ModelMenu() constructor"
    console.log(' Verifying nominal construction when ctor called with valid locale fn...')

    if (nrmlMenuModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + nrmlMenuModel.getLocale()
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #3
  let menuModel = new ModelMenu(() => {return "en-US"})
  try {
    failure = ""
    cut = "ModelMenu.getMenuTitle()"
    console.log(' Verifying expected menu title is returned from getter ...')

    let title = menuModel.getMenuTitle()

    if (title !== "Menu") {
      failure = "Expected menu title of 'Menu', but got " + title
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }
}
