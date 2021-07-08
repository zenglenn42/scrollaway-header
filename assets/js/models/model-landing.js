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

function ModelLanding(locale) {
  this.dfltLocale = "en-US"
  this.locale = (this.isValidLocale(locale)) ? locale : this.dfltLocale

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
      appName: "सिटी मैच",
      slogan: "अपने शहर का पता लगाएं",

      // NB: Strive to keep blurb text short, ideally not more than 2 sentences
      //     with each sentence < 80 characters.

      blurb: "एक कदम के बारे में सोच लेकिन यकीन नहीं है कि कौन सा शहर आपका सबसे अच्छा दांव है?\n" +
             "अपनी प्राथमिकताओं को साझा करें और हम विचार करने के लिए कुछ विकल्प पेश करेंगे।",
      copyrightDate: "2021"
    }
  }
}

ModelLanding.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" || locale === "hi-IN")
}

ModelLanding.prototype.getLocale = function() {
  if (this.isValidLocale(this.locale)) {
    return this.locale
  } else {
    console.log("ModelLanding.getLocale() Info: returning default locale. Not", this.locale)
    return this.dfltLocale
  }
}

ModelLanding.prototype.setLocale = function(locale) {
  let result = false
  if (this.isValidLocale(locale)) {
    this.locale = locale
    result = true
  } else {
    console.log('Error ModelLanding.setLocale.  Invalid locale:', locale)
  }
  return result
}

ModelLanding.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelLanding.prototype.getAppName = function() {
  let result = "missing_appName"
  if (this.isValidLocaleProperty(this.locale, 'appName')) {
    result = this.msgCatalog[this.locale].appName
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'appName')) {
    result = this.msgCatalog[this.dfltLocale].appName
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelLanding:getAppName() Error ", result)
  }
  return result
}

ModelLanding.prototype.getSlogan = function() {
  let result = "missing_slogan"
  if (this.isValidLocaleProperty(this.locale, 'slogan')) {
    result = this.msgCatalog[this.locale].slogan
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'slogan')) {
    result = this.msgCatalog[this.dfltLocale].slogan
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelLanding:getSlogan() Error ", result)
  }
  return result
}

ModelLanding.prototype.getBlurb = function() {
  let result = "missing_blurb"
  if (this.isValidLocaleProperty(this.locale, 'blurb')) {
    result = this.msgCatalog[this.locale].blurb
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'blurb')) {
    result = this.msgCatalog[this.dfltLocale].blurb
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelLanding:getBlurb() Error ", result)
  }
  return result
}

ModelLanding.prototype.getCopyrightDate = function() {
  let result = "missing_date"
  if (this.isValidLocaleProperty(this.locale, 'copyrightDate')) {
    result = this.msgCatalog[this.locale].copyrightDate
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'copyrightDate')) {
    result = this.msgCatalog[this.dfltLocale].copyrightDate
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
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

    if (dfltLandingModel.locale !== "en-US") {
      failure = "Expected locale of en-US, but got " + dfltLandingModel.locale
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
    let nrmlLandingModel = new ModelLanding("en-US")
    cut = "ModelLanding('en-US') constructor"
    console.log(' Verifying nominal construction when ctor called with valid locale ...')

    if (nrmlLandingModel.locale !== "en-US") {
      failure = "Expected locale of en-US, but got " + nrmlLandingModel.locale
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
    let failLandingModel = new ModelLanding("bogus-locale")
    cut = "ModelLanding('bogus-locale') constructor"

    // TODO: Should ctor throw exception or resiliently fallback to default construction?
    console.log(' Verifying fallback construction when ctor called with invalid locale ...')

    if (failLandingModel.locale !== "en-US") {
      failure = "Expected fallback locale of en-US, but got " + failLandingModel.locale
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
  let landingModel = new ModelLanding("en-US")
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

  // Test #5
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

  // Test #6
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

  // Test #7
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
