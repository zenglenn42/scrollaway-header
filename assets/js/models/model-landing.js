//----------------------------------------------------------------------------------
// ModelLanding
//
// This class maintains state related to the application's landing page:
//
//    app name, 
//    slogan,
//    call-to-action blurb
//----------------------------------------------------------------------------------
// TODO: Make this observable (in the software patterns sense).
// TODO: Decide if ctor should throw exception on invalid input versus resilient
//       fallback to default values.
//----------------------------------------------------------------------------------

// The locale codes are based upon a two-letter language tag (see IETF BCP-47)
// and a two-letter region code (see ISO 3166).

function ModelLanding(getLocale = () => {return "en-US"}) {

  if (!getLocale || typeof getLocale !== 'function') {
    throw('ModelLanding: Failed constructor.  Invalid getLocale fn parameter')
  }
  this.getLocale = getLocale
  this.dfltLocale = "en-US"

  this.msgCatalog = {
    "en-US": {
      appName: "City Match",
      slogan: "Find your city",

      // NB: Strive to keep blurb text short, ideally not more than 2 sentences
      //     with each sentence < 80 characters.

      blurb: "Thinking about a move but not sure which city is your best bet?\n" +
             "Share your priorities and we'll offer some options to consider.",
      copyrightDate: "2021"
    },
    "hi-IN": {
      appName: "सिसपनों का शहर",
      slogan: "अपने सपनों का शहर खोजें",

      // NB: Strive to keep blurb text short, ideally not more than 2 sentences
      //     with each sentence < 80 characters.

      blurb: "एक अलग शहर में जाने के बारे में सोच रहे हैं लेकिन यह सुनिश्चित नहीं है कि मेरे लिए सबसे अच्छा शहर कौन सा है?\n" +
             "अपनी प्राथमिकताएं प्रदान करें और हम कुछ विकल्प देंगे।",
      copyrightDate: "2021"
    },
    "es-ES": {
      appName: "Ciudad de Sueños",
      slogan: "Encuentra tu ciudad",

      // NB: Strive to keep blurb text short, ideally not more than 2 sentences
      //     with each sentence < 80 characters.

      blurb: "¿Estás pensando en mudarte pero no estás seguro de cuál es tu mejor opción?\n" +
             "Comparta sus prioridades y le ofreceremos algunas opciones a considerar.",
      copyrightDate: "2021"
    },
    "zh-CN": {
      appName: "梦想之城", // Dream City
      slogan: "找到你的城市",

      // NB: Strive to keep blurb text short, ideally not more than 2 sentences
      //     with each sentence < 80 characters.

      blurb: "正在考虑搬家但不确定哪个城市是您的最佳选择？\n" +
             "分享您的优先事项，我们将提供一些可供考虑的选项。",
      copyrightDate: "2021"
    }
  }
}

ModelLanding.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" ||
          locale === "hi-IN" ||
          locale === "es-ES" ||
          locale === "zh-CN")
}

ModelLanding.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelLanding.prototype.getAppName = function() {
  let result = "missing_appName"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'appName')) {
    result = this.msgCatalog[locale].appName
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'appName')) {
    result = this.msgCatalog[this.dfltLocale].appName
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelLanding:getAppName() Error ", result)
  }
  return result
}

ModelLanding.prototype.getSlogan = function() {
  let result = "missing_slogan"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'slogan')) {
    result = this.msgCatalog[locale].slogan
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'slogan')) {
    result = this.msgCatalog[this.dfltLocale].slogan
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelLanding:getSlogan() Error ", result)
  }
  return result
}

ModelLanding.prototype.getBlurb = function() {
  let result = "missing_blurb"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'blurb')) {
    result = this.msgCatalog[locale].blurb
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'blurb')) {
    result = this.msgCatalog[this.dfltLocale].blurb
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelLanding:getBlurb() Error ", result)
  }
  return result
}

ModelLanding.prototype.getCopyrightDate = function() {
  let result = "missing_date"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'copyrightDate')) {
    result = this.msgCatalog[locale].copyrightDate
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'copyrightDate')) {
    result = this.msgCatalog[this.dfltLocale].copyrightDate
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelLanding:getCopyrightDate() Error ", result)
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

function UnitTestModelLanding() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "model-landing.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')


  // Test #1
  try {
    let dfltLandingModel = new ModelLanding()
    cut = "ModelLanding() dflt constructor"
    console.log(' Verifying default construction when ctor called without params ...')

    if (dfltLandingModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + dfltLandingModel.getLocale()
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
    let nrmlLandingModel = new ModelLanding(() => {return "en-US"})
    cut = "ModelLanding('en-US') constructor"
    console.log(' Verifying nominal construction when ctor called with valid locale getter...')

    if (nrmlLandingModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + nrmlLandingModel.getLocale()
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
  let landingModel = new ModelLanding()
  try {
    failure = ""
    cut = "ModelLanding.getAppName()"
    console.log(' Verifying expected application name is returned from getter ...')

    let appName = landingModel.getAppName()

    if (appName !== "City Match") {
      failure = "Expected appName of 'City Match', but got " + appName
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
  try {
    failure = ""
    cut = "ModelLanding.getSlogan()"
    console.log(' Verifying expected slogan is returned from getter ...')

    let slogan = landingModel.getSlogan()

    if (slogan !== "Find your city") {
      failure = "Expected slogan of 'Find your city', but got " + slogan
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #5
  try {
    failure = ""
    cut = "ModelLanding.getBlurb()"
    console.log(' Verifying expected blurb is returned from getter ...')

    let actualBlurb = landingModel.getBlurb()
    let expectedBlurb = "Thinking about a move but not sure which city is your best bet?\n" +
                         "Share your priorities and we'll offer some options to consider."

    if (actualBlurb !== expectedBlurb) {
      failure = "Didn't get expected blurb.  Got " + actualBlurb
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #6
  try {
    failure = ""
    cut = "ModelLanding.getCopyrightDate()"
    console.log(' Verifying expected copyright date is returned from getter ...')

    let actualCrDate = landingModel.getCopyrightDate()
    let expectCrDate = '2021'

    if (actualCrDate !== expectCrDate) {
      failure = "Expected copyright date of " + expectCrDate + " Got " + actualCrDate
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
