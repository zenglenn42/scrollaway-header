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

function ModelMenu(locale) {
  this.dfltLocale = "en-US"
  this.locale = (this.isValidLocale(locale)) ? locale : this.dfltLocale

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

ModelMenu.prototype.getLocale = function() {
  if (this.isValidLocale(this.locale)) {
    return this.locale
  } else {
    console.log("ModelMenu.getLocale() Info: returning default locale. Not", this.locale)
    return this.dfltLocale
  }
}

ModelMenu.prototype.setLocale = function(locale) {
  let result = false
  if (this.isValidLocale(locale)) {
    this.locale = locale
    result = true
  } else {
    console.log('Error ModelMenu.setLocale.  Invalid locale:', locale)
  }
  return result
}

ModelMenu.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelMenu.prototype.getMenuTitle = function() {
  let result = "missing_title"
  if (this.isValidLocaleProperty(this.locale, 'title')) {
    result = this.msgCatalog[this.locale].title
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'title')) {
    result = this.msgCatalog[this.dfltLocale].title
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuTitle() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuView = function() {
  let result = "missing_view"
  if (this.isValidLocaleProperty(this.locale, 'view')) {
    result = this.msgCatalog[this.locale].view
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'view')) {
    result = this.msgCatalog[this.dfltLocale].view
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuView() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewIntro = function() {
  let result = "missing_view_intro"
  if (this.isValidLocaleProperty(this.locale, 'viewIntro')) {
    result = this.msgCatalog[this.locale].viewIntro
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewIntro')) {
    result = this.msgCatalog[this.dfltLocale].viewIntro
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuViewIntro() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewPriorities = function() {
  let result = "missing_view_priorities"
  if (this.isValidLocaleProperty(this.locale, 'viewPriorities')) {
    result = this.msgCatalog[this.locale].viewPriorities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewPriorities')) {
    result = this.msgCatalog[this.dfltLocale].viewPriorities
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuViewPriorities() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewBestBets = function() {
  let result = "missing_view_bestbets"
  if (this.isValidLocaleProperty(this.locale, 'viewBestBets')) {
    result = this.msgCatalog[this.locale].viewBestBets
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewBestBets')) {
    result = this.msgCatalog[this.dfltLocale].viewBestBets
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuViewBestBets() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuViewBlog = function() {
  let result = "missing_view_blog"
  if (this.isValidLocaleProperty(this.locale, 'viewBlog')) {
    result = this.msgCatalog[this.locale].viewBlog
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'viewBlog')) {
    result = this.msgCatalog[this.dfltLocale].viewBlog
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuViewBlog() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettings = function() {
  let result = "missing_settings"
  if (this.isValidLocaleProperty(this.locale, 'settings')) {
    result = this.msgCatalog[this.locale].settings
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'settings')) {
    result = this.msgCatalog[this.dfltLocale].settings
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuSettings() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettingsEdit = function() {
  let result = "missing_settings_edit"
  if (this.isValidLocaleProperty(this.locale, 'settingsEdit')) {
    result = this.msgCatalog[this.locale].settingsEdit
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'settingsEdit')) {
    result = this.msgCatalog[this.dfltLocale].settingsEdit
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuSettingsEdit() Error ", result)
  }
  return result
}

ModelMenu.prototype.getMenuSettingsUseLang = function(lang = "missing_lang") {
  let result = "missing_settings_useLang"
  if (this.isValidLocaleProperty(this.locale, 'useLang')) {
    result = this.msgCatalog[this.locale].useLang
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'useLang')) {
    result = this.msgCatalog[this.dfltLocale].useLang
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuSettingsUseLang() Error ", result)
  }
  result = result.replace("%s", lang)
  return result
}

ModelMenu.prototype.getMenuSettingsShowCities = function(country = "missing_country") {
  let result = "missing_settings_showCities"
  if (this.isValidLocaleProperty(this.locale, 'showCities')) {
    result = this.msgCatalog[this.locale].showCities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showCities')) {
    result = this.msgCatalog[this.dfltLocale].showCities
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuSettingsShowCities() Error ", result)
  }
  result = result.replace("%s", country)
  return result
}

ModelMenu.prototype.getMenuSettingsShowTop = function(numCities) {
  let result = "missing_settings_showTop"
  if (this.isValidLocaleProperty(this.locale, 'showTop')) {
    result = this.msgCatalog[this.locale].showTop
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showTop')) {
    result = this.msgCatalog[this.dfltLocale].showTop
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelMenu:getMenuSettingsShowTop() Error ", result)
  }
  result = result.replace("%d", JSON.stringify(numCities))
  return result
}

ModelMenu.prototype.getMenuSettingsHelp = function() {
  let result = "missing_settings_help"
  if (this.isValidLocaleProperty(this.locale, 'help')) {
    result = this.msgCatalog[this.locale].help
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'help')) {
    result = this.msgCatalog[this.dfltLocale].help
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
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

    if (dfltMenuModel.locale !== "en-US") {
      failure = "Expected locale of en-US, but got " + dfltMenuModel.locale
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
    let nrmlMenuModel = new ModelMenu("en-US")
    cut = "ModelMenu('en-US') constructor"
    console.log(' Verifying nominal construction when ctor called with valid locale ...')

    if (nrmlMenuModel.locale !== "en-US") {
      failure = "Expected locale of en-US, but got " + nrmlMenuModel.locale
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
  try {
    failure = ""
    let failMenuModel = new ModelMenu("bogus-locale")
    cut = "ModelMenu('bogus-locale') constructor"

    // TODO: Should ctor throw exception or resiliently fallback to default construction?
    console.log(' Verifying fallback construction when ctor called with invalid locale ...')

    if (failMenuModel.locale !== "en-US") {
      failure = "Expected fallback locale of en-US, but got " + failMenuModel.locale
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #4
  let menuModel = new ModelMenu("en-US")
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
