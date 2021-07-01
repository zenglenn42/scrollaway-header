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
      title: "Menu"
    }
  }
}

ModelMenu.prototype.isValidLocale = function(locale) {
  return (locale === "en-US")
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
