//----------------------------------------------------------------------------------
// ModelSettings
//
// This class maintains state related to the application's settings:
//
//    language, 
//    country of interest, 
//    number of cities to include in the ranked results
//
// Support for localization is sketched out, though we're currently
// hard coding for an en-US locale.
//----------------------------------------------------------------------------------
// TODO: Make this observable (in the software patterns sense).
//
// TODO: Take a page from this model and introduce it to other models for supporting
//       localization.
//----------------------------------------------------------------------------------

function ModelSettings(numCities, maxResults, locale, countryCode) {

  // Number of cities in the database for the country indicated by countryCode.

  this.dfltNumCities = 0
  this.numCities = (this.isValidNumCities(numCities)) ? numCities : this.dfltNumCities

  // Number of cities to present as "best bests" in the results view.

  this.dfltMaxResults = Math.min(this.numCities, 10)
  this.maxResults = (this.isValidMaxResults(maxResults)) ? maxResults : this.dfltMaxResults

  // Populates drop-down selection list in view.

  this.dfltMaxResultsOptions = [this.maxResults]
  this.maxResultsOptions = [5, 10, 20] // TODO: Make this algorithmic, using numCities 
                                       // as an upper-bound on maxResultsOptions.
  if (!this.isValidNumCities(numCities) || numCities < 20) {
    this.maxResultsOptions = this.dfltMaxResultsOptions
  }

  // Select from among these (ISO 639-1) languages for the user interface.
  // Populates drop-down selection list in view.

  //--------------------------------------------------------------------------------
  // NB: We really don't have internationalization support yet, but sketch
  //     out how that could integrate with the front-end with some 
  //     place-holder parameters for language and country code.
  //--------------------------------------------------------------------------------

  this.dfltLocale = "en-US"
  this.locale = (this.isValidLocale(locale)) ? locale : this.dfltLocale
  this.langOptionsMap = {
    "en-US": {
      name: "English",
      enName: "English",
      supported: true
    },
    "hi-IN": {
      name: "हिंदी",
      enName: "Hindi",
      supported: true
    },
    "es-ES": {
      name: "Español",
      enName: "Spanish",
      supported: true  // May be used by view to gray out a selection list option.
    }
  }

  // Select from among these (ISO 3166) countries when looking for a city match.
  // Populates drop-down selection list in view.
  //
  // The currency abbreviation comes from:
  // https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
  // and is used by Intl.NumberFormat() in the view layer to format currency.

  this.dfltCountryCode = "US"
  this.countryCode = (this.isValidCountryCode(countryCode)) ? countryCode : this.dfltCountryCode
  this.countryOptionsMap = {
    "US": {
      name: "United States",
      supported: true,
      currency: "USD"
    },
    "IN": {
      name: "India",
      supported: false,
      currency: "USD"   // Should probably be rupies for full localization.
    },
    "CR": {
      name: "Costa Rica",
      supported: false, // Grayed out in user interface.
      currency: "CRC"
    }
  }

  this.msgCatalog = {
    "en-US": {
      title: "Edit settings ...",
      selectLang: "Select language",
      useLang: "Use",
      selectCountry: "Select country",
      showCities: "Show cities in",
      selectQuantity: "Select quantity",
      showTop: "Show top",
      showTopCities: "cities"
    },
    "hi-IN": {
      title: "सेटिंग अपडेट करें ...",
      selectLang: "भाषा का चयन करें",
      useLang: "भाषा का प्रयोग करें",
      selectCountry: "देश चुनें",
      showCities: "शहरों में दिखाओ",
      selectQuantity: "मात्रा चुनें",
      showTop: "शीर्ष ",
      showTopCities: "शहरों को दिखाएं"
    },
    "es-ES": {
      title: "Editar configuración ...",
      selectLang: "Seleccione el idioma",
      useLang: "Usar",
      selectCountry: "Seleccionar país",
      showCities: "Mostrar ciudades en",
      selectQuantity: "Selecciona la cantidad",
      showTop: "Mostrar las",
      showTopCities: "mejores ciudades"
    },
  }
}

ModelSettings.prototype.githubUrl = 
  "https://github.com/zenglenn42/CityMatch/blob/master/README.md"

ModelSettings.prototype.restoreDefaults = function() {
  this.maxResults = this.dfltMaxResults
  this.locale = this.dfltLocale
  this.countryCode = this.dfltCountryCode
}

ModelSettings.prototype.isValidNumCities = function(numCities) {
  return (numCities && Number.isInteger(numCities) && Number.isInteger(numCities) > 0)
}

ModelSettings.prototype.getNumCities = function() {
  return this.numCities
}

ModelSettings.prototype.setNumCities = function(numCities) {
  let result = false
  if (this.isValidNumCities(numCities)) {
    this.numCities = numCities
    result = true
  } else {
    console.log('Error ModelSettings.setNumCities.  Invalid value:', numCities)
  }
  return result
}

ModelSettings.prototype.isValidMaxResults = function(maxResults) {
  // TODO: When city model data becomes dynamic, we should probably
  //       make this model subscribe to city model for changes in numCities.
  return Number.isInteger(maxResults) && maxResults > 0 && maxResults <= this.numCities
}

ModelSettings.prototype.getMaxResults = function() {
  if (this.isValidMaxResults(this.maxResults)) {
    return this.maxResults
  } else {
    return this.dfltMaxResults
  }
}

ModelSettings.prototype.setMaxResults = function(maxResults) {
  let result = false
  if (this.isValidMaxResults(maxResults)) {
    this.maxResults = maxResults
    result = true
  } else {
    console.log('Error ModelSettings.setMaxResults.  maxResults out of range:', maxResults)
  }
  return result
}

ModelSettings.prototype.getMaxResultsOptions = function() {
  // Return a copy of the array so model doesn't get accidentally mutated by view.
  return this.maxResultsOptions.slice(0)  
}

ModelSettings.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" || locale === "hi-IN" || "es-ES")
}

// Introduce notion of locale (based upon BCP 47 standard).
//
// This descriptor composes language with region and is key
// to localization efforts.
//
// Locales embody regional differences that affect how content
// is presented (e.g., numeric formatting, currency designators, 
// written script variants such as 'simplified' versus 'traditional' 
// Chinese).

ModelSettings.prototype.getLocale = function() {
  if (this.isValidLocale(this.locale)) {
    return this.locale
  } else {
    return this.dfltLocale
  }
}

ModelSettings.prototype.getLangName = function(locale) {
  let langName = "missing-langName"
  if (this.isValidLocale(this.locale)) {
    langName = (this.langOptionsMap.hasOwnProperty(locale) &&
                this.langOptionsMap[locale].hasOwnProperty('name')) ?
               this.langOptionsMap[locale].name : locale + "-" + langName
  } else {
    console.error('ModelSettings.getLangName(locale): Invalid locale =', locale)
  }
  return langName
}

ModelSettings.prototype.getLangOptionsMap = function() {
  return JSON.parse(JSON.stringify(this.langOptionsMap))
}

ModelSettings.prototype.setLocale = function(locale) {
  let result = false
  if (this.isValidLocale(locale)) {
    this.locale = locale
    result = true
  } else {
    console.log('Error ModelSettings.setLocale.  Invalid locale:', locale)
  }
  return result
}

ModelSettings.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelSettings.prototype.isValidCountryCode = function(countryCode) {
  return (countryCode === "US" || countryCode === "IN" )
}

ModelSettings.prototype.getCountryCode = function() {
  if (this.isValidCountryCode(this.countryCode)) {
    return this.countryCode
  } else {
    return this.dfltCountryCode
  }
}

ModelSettings.prototype.getCountryName = function(countryCode) {
  let countryName = "missing-countryName"
  if (this.isValidCountryCode(this.countryCode)) {
    countryName =
        (this.countryOptionsMap.hasOwnProperty(countryCode) &&
         this.countryOptionsMap[countryCode].hasOwnProperty('name')) ?
        this.countryOptionsMap[countryCode].name : countryCode + "-" + countryName
  } else {
    console.error('ModelSettings.getLangName(countryCode): Invalid countryCode =', countryCode)
  }
  return countryName
}

ModelSettings.prototype.getCountryOptionsMap = function() {
  return JSON.parse(JSON.stringify(this.countryOptionsMap))
}

ModelSettings.prototype.setCountryCode = function(countryCode) {
  let result = false
  if (this.isValidCountryCode(countryCode)) {
    this.countryCode = countryCode
    result = true
  } else {
    console.log('Error ModelSettings.setCountryCode.  Invalid country code:', countryCode)
  }
  return result
}

// Return the 3-letter iso-currency descriptor associated with
// a given country code as defined by this site:
// https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
//
// For example, given the countryCode = "US" return "USD".
// This is used by the view to generate the related "$" symbol.

ModelSettings.prototype.getCurrency = function(countryCode) {
  let code = countryCode || this.countryCode

  return this.countryOptionsMap[code].currency
}

ModelSettings.prototype.getTitle = function() {
  let result = "missing_title"
  if (this.isValidLocaleProperty(this.locale, 'title')) {
    result = this.msgCatalog[this.locale].title
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'title')) {
    result = this.msgCatalog[this.dfltLocale].title
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getTitle() Error ", result)
  }
  return result
}

ModelSettings.prototype.getSelectLang = function() {
  let result = "missing_selectLang"
  if (this.isValidLocaleProperty(this.locale, 'selectLang')) {
    result = this.msgCatalog[this.locale].selectLang
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'selectLang')) {
    result = this.msgCatalog[this.dfltLocale].selectLang
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getSelectLang() Error ", result)
  }
  return result
}

ModelSettings.prototype.getUseLang = function() {
  let result = "missing_useLang"
  if (this.isValidLocaleProperty(this.locale, 'useLang')) {
    result = this.msgCatalog[this.locale].useLang
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'useLang')) {
    result = this.msgCatalog[this.dfltLocale].useLang
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getUseLang() Error ", result)
  }
  return result
}

ModelSettings.prototype.getSelectCountry = function() {
  let result = "missing_selectCountry"
  if (this.isValidLocaleProperty(this.locale, 'selectCountry')) {
    result = this.msgCatalog[this.locale].selectCountry
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'selectCountry')) {
    result = this.msgCatalog[this.dfltLocale].selectCountry
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getSelectCountry() Error ", result)
  }
  return result
}

ModelSettings.prototype.getShowCities = function() {
  let result = "missing_showCities"
  if (this.isValidLocaleProperty(this.locale, 'showCities')) {
    result = this.msgCatalog[this.locale].showCities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showCities')) {
    result = this.msgCatalog[this.dfltLocale].showCities
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getShowCities() Error ", result)
  }
  return result
}

ModelSettings.prototype.getSelectQuantity = function() {
  let result = "missing_selectQuantity"
  if (this.isValidLocaleProperty(this.locale, 'selectQuantity')) {
    result = this.msgCatalog[this.locale].selectQuantity
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'selectQuantity')) {
    result = this.msgCatalog[this.dfltLocale].selectQuantity
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getSelectQuantity() Error ", result)
  }
  return result
}

ModelSettings.prototype.getShowTopCitiesBegin = function() {
  let result = "missing_showTop"
  if (this.isValidLocaleProperty(this.locale, 'showTop')) {
    result = this.msgCatalog[this.locale].showTop
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showTop')) {
    result = this.msgCatalog[this.dfltLocale].showTop
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getShowTopCities() Error ", result)
  }
  return result
}

ModelSettings.prototype.getShowTopCitiesEnd = function() {
  let result = "missing_showTopCities"
  if (this.isValidLocaleProperty(this.locale, 'showTopCities')) {
    result = this.msgCatalog[this.locale].showTopCities
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'showTopCities')) {
    result = this.msgCatalog[this.dfltLocale].showTopCities
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelSettings:getShowTopCitiesCities() Error ", result)
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

function UnitTestModelSettings() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "model-settings.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')

  console.log(' Instantiating model settings object ...')
  let settings = new ModelSettings()

  // Test #1
  try {
    cut = "ModelSettings(ctor)"
    console.log(' Verifying default construction ...')
    if (settings.numCities !== 0) {
      failure = "Expected numCities == 0.  Got numCities == " + settings.numCities
    } else if (settings.maxResults !== 0) {
      failure = "Expected maxResults == 0. Got maxResults == " + settings.maxResults
    } else if (JSON.stringify(settings.maxResultsOptions) !== JSON.stringify([0])) {
      failure = "Expected maxResultsOptions == [0]. Got maxResultsOptions == " + settings.maxResultsOptions
    } else if (settings.locale !== "en-US") {
      failure = "Expected locale == 'en-US'. Got locale == " + settings.locale
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
  failure = undefined
  try {
    cut = "ModelSettings.setNumCities()"
    console.log(' Verifying ability to set numCities ...')
    settings.setNumCities(42)
    let numCities = settings.getNumCities()
    if (numCities !== 42) {
      failure = "Unable to set/get numCities.  Expected to get 42.  Got numCities == " + numCities
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
  failure = undefined
  try {
    cut = "ModelSettings.setMaxResults()"
    console.log(' Verifying ability to set maxResults ...')
    settings.setMaxResults(17)
    let maxResults = settings.getMaxResults()
    if (maxResults !== 17) {
      failure = "Unable to set/get maxResults.  Expected to get 17.  Got maxResults == " + maxResults
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
  failure = undefined
  try {
    cut = "ModelSettings.setLocale()"
    console.log(' Verifying ability to set locale ...')
    settings.setLocale("en-US")
    let locale = settings.getLocale()
    if (locale !== "en-US") {
      failure = "Unable to set/get locale.  Expected to get 'en-US'.  Got locale == " + locale
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
  failure = undefined
  try {
    cut = "ModelSettings.setCountryCode()"
    console.log(' Verifying ability to set countryCode ...')
    settings.setCountryCode("US")
    let countryCode = settings.getCountryCode()
    if (countryCode !== "US") {
      failure = "Unable to set/get countryCode.  Expected to get 'US'.  Got countryCode == " + countryCode
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
  failure = undefined
  try {
    cut = "ModelSettings.getMaxResultsOptions()"
    console.log(' Verifying ability to get maxResultsOptions array ...')
    settings = new ModelSettings(178)
    let maxResultsOptions = settings.getMaxResultsOptions()
    if (JSON.stringify(maxResultsOptions) !== JSON.stringify([5, 10, 20])) {
      failure = "Expected [5, 10, 20].  Got maxResultsOptions == " + maxResultsOptions
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
  failure = undefined
  try {
    cut = "ModelSettings(ctor) negative case"
    console.log(' Verifying fallback to default values on invalid ctor params ...')
    let badMaxResults = "i should be a number"
    let badLocale = "bd"
    let badCountryCode = "BD"
    settings = new ModelSettings(178, badMaxResults, badLocale, badCountryCode)
    if (settings.maxResults !== settings.dfltMaxResults) {
      failure = "Expected maxResults == " + settings.dfltMaxResults + " Got maxResults == " + settings.maxResults
    }
    if (settings.locale !== settings.dfltLocale) {
      failure += "\nExpected locale == " + settings.dfltLocale + " Got locale == " + settings.countryCode
    }
    if (settings.countryCode !== settings.dfltCountryCode) {
      failure += "\nExpected countryCode == " + settings.dfltCountryCode + " Got countryCode == " + settings.countryCode
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #8
  failure = undefined
  try {
    cut = "ModelSettings.getLangName(locale) positive case"
    console.log(' Verifying ability to fetch a language name given a iso lang code ...')
    let langName = settings.getLangName("en-US")
    if (langName !== "English") {
      failure = "Expected langName == 'English'" + " Got " + langName
    }
    langName = settings.getLangName("es-ES")
    if (langName !== "Español") {
      failure += "\nExpected langName == 'Español'" + " Got " + langName
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #9
  failure = undefined
  try {
    cut = "ModelSettings.getLangName(locale) negative case"
    console.log(' Verifying ability to fetch a language name given a iso lang code ...')
    let langName = settings.getLangName("bogus")
    if (langName !== "bogus-missing-langName") {
      failure = "Expected countryName == 'bogus-missing-langName'" + " Got " + langName
    }
    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #10
  failure = undefined
  try {
    settings = new ModelSettings(178, 10, "en-US", "US")
    cut = "ModelSettings.getCountryName(countryCode), *.getLocale(), *.getCurrency()  positive case"
    console.log(' Verifying ability to fetch a country name given an iso country code ...')
    let countryName = settings.getCountryName("US")
    if (countryName !== "United States") {
      failure = "Expected countryName == 'United States'" + " Got " + countryName
    }
    countryName = settings.getCountryName("CR")
    if (countryName !== "Costa Rica") {
      failure += "\nExpected countryName == 'Costa Rica'" + " Got " + countryName
    }
    console.log(' Verifying ability to fetch locale and currency abbreviations from a settings object ...')
    let locale = settings.getLocale()
    if (locale !== "en-US") {
      failure = "\nExpected locale == 'en-US'" + " Got " + locale
    }
    let currency = settings.getCurrency()
    if (currency !== "USD") {
      failure = "\nExpected currency == 'USD'" + " Got " + currency
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #11
  failure = undefined
  try {
    cut = "ModelSettings.getCountryName(countryCode) negative case"
    console.log(' Verifying ability to fetch a country name given an iso country code ...')
    let countryName = settings.getCountryName("bogus")
    if (countryName !== "bogus-missing-countryName") {
      failure = "Expected countryName == 'bogus-missing-countryName'" + " Got " + countryName
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
