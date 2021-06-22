function SettingsModel(numCities, maxResults, langCode, countryCode) {

  // Number of cities in the database for the country indicated by countryCode.

  this.dfltNumCities = 0
  this.numCities = (this.isValidNumCities(numCities)) ? numCities : this.dfltNumCities

  // Number of cities to present as "best bests" in the results view.

  this.dfltMaxResults = Math.min(this.numCities, 10)
  this.maxResults = (this.isValidMaxResults(maxResults)) ? maxResults : this.dfltMaxResults

  // Populates drop-down selection list in view.
  // TODO: Make this algorithmic, using numCities as an upper-bound on maxResultsOptions.

  this.dfltMaxResultsOptions = [this.maxResults]
  this.maxResultsOptions = [5, 10, 20] 
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

  this.dfltLangCode = "en"
  this.langCode = (this.isValidLangCode(langCode)) ? langCode : this.dfltLangCode
  this.langOptionsMap = {
    "en": {
      name: "English",
      enName: "English",
      supported: true
    },
    "es": {
      name: "Español",
      enName: "Spanish",
      supported: false  // May be used by view to gray out a selection list option.
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
    "CR": {
      name: "Costa Rica",
      supported: false, // Grayed out in user interface.
      currency: "CRC"
    }
  }
}

SettingsModel.prototype.restoreDefaults = function() {
  this.maxResults = this.dfltMaxResults
  this.langCode = this.dfltLangCode
  this.countryCode = this.dfltCountryCode
};

SettingsModel.prototype.isValidNumCities = function(numCities) {
  return (numCities && Number.isInteger(numCities) && Number.isInteger(numCities) > 0)
}

SettingsModel.prototype.getNumCities = function() {
  return this.numCities
};

SettingsModel.prototype.setNumCities = function(numCities) {
  let result = false;
  if (this.isValidNumCities(numCities)) {
    this.numCities = numCities
    result = true
  } else {
    console.log('Error SettingsModel.setNumCities.  Invalid value:', numCities)
  }
  return result
};

SettingsModel.prototype.isValidMaxResults = function(maxResults) {
  // TODO: When city model data becomes dynamic, we should probably
  //       make this model subscribe to city model for changes in numCities.
  return Number.isInteger(maxResults) && maxResults > 0 && maxResults <= this.numCities
};

SettingsModel.prototype.getMaxResults = function() {
  if (this.isValidMaxResults(this.maxResults)) {
    return this.maxResults
  } else {
    return this.dfltMaxResults
  }
};

SettingsModel.prototype.setMaxResults = function(maxResults) {
  let result = false;
  if (this.isValidMaxResults(maxResults)) {
    this.maxResults = maxResults
    result = true
  } else {
    console.log('Error SettingsModel.setMaxResults.  maxResults out of range:', maxResults)
  }
  return result
};

SettingsModel.prototype.getMaxResultsOptions = function() {
  // Return a copy of the array so model doesn't get accidentally mutated by view.
  return this.maxResultsOptions.slice(0)  
};

SettingsModel.prototype.isValidLangCode = function(langCode) {
  return (langCode === "en")
};

SettingsModel.prototype.getLangCode = function() {
  if (this.isValidLangCode(this.langCode)) {
    return this.langCode
  } else {
    return this.dfltLangCode
  }
};

SettingsModel.prototype.getLangName = function(langCode) {
  let langName = "missing-langName"
  if (this.isValidLangCode(this.langCode)) {
    langName = (this.langOptionsMap.hasOwnProperty(langCode) &&
                this.langOptionsMap[langCode].hasOwnProperty('name')) ?
               this.langOptionsMap[langCode].name : langCode + "-" + langName
  } else {
    console.error('SettingsModel.getLangName(langCode): Invalid langCode =', langCode)
  }
  return langName
};

SettingsModel.prototype.getLangOptionsMap = function() {
  return JSON.parse(JSON.stringify(this.langOptionsMap))
};

SettingsModel.prototype.setLangCode = function(langCode) {
  let result = false;
  if (this.isValidLangCode(langCode)) {
    this.langCode = langCode
    result = true
  } else {
    console.log('Error SettingsModel.setLangCode.  Invalid lang code:', langCode)
  }
  return result
};

SettingsModel.prototype.isValidCountryCode = function(countryCode) {
  return (countryCode === "US")
};

SettingsModel.prototype.getCountryCode = function() {
  if (this.isValidCountryCode(this.countryCode)) {
    return this.countryCode
  } else {
    return this.dfltCountryCode
  }
};

SettingsModel.prototype.getCountryName = function(countryCode) {
  let countryName = "missing-countryName"
  if (this.isValidCountryCode(this.countryCode)) {
    countryName =
        (this.countryOptionsMap.hasOwnProperty(countryCode) &&
         this.countryOptionsMap[countryCode].hasOwnProperty('name')) ?
        this.countryOptionsMap[countryCode].name : countryCode + "-" + countryName
  } else {
    console.error('SettingsModel.getLangName(countryCode): Invalid countryCode =', countryCode)
  }
  return countryName
};

SettingsModel.prototype.getCountryOptionsMap = function() {
  return JSON.parse(JSON.stringify(this.countryOptionsMap))
};

SettingsModel.prototype.setCountryCode = function(countryCode) {
  let result = false;
  if (this.isValidCountryCode(countryCode)) {
    this.countryCode = countryCode
    result = true
  } else {
    console.log('Error SettingsModel.setCountryCode.  Invalid country code:', countryCode)
  }
  return result
};

// Introduce notion of locale (based upon BCP 47 standard).
//
// This descriptor composes language with region and is key
// to localization efforts.
//
// Locales embody regional differences that affect how content
// is presented (e.g., numeric formatting, currency designators, 
// written script variants such as 'simplified' versus 'traditional' 
// Chinese).

SettingsModel.prototype.getLocale = function() {
  return this.langCode + "-" + this.countryCode
}

// Return the 3-letter iso-currency descriptor associated with
// a given country code as defined by this site:
// https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
//
// For example, given the countryCode = "US" return "USD".
// This is used by the view to generate the related "$" symbol.

SettingsModel.prototype.getCurrency = function(countryCode) {
  let code = countryCode || this.countryCode

  return this.countryOptionsMap[code].currency
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

function UnitTestSettingsModel() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "settings-model.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')

  console.log(' Instantiating settings model object ...')
  let settings = new SettingsModel()

  // Test #1
  try {
    cut = "SettingsModel(ctor)"
    console.log(' Verifying default construction ...')
    if (settings.numCities !== 0) {
      failure = "Expected numCities == 0.  Got numCities == " + settings.numCities
    } else if (settings.maxResults !== 0) {
      failure = "Expected maxResults == 0. Got maxResults == " + settings.maxResults
    } else if (JSON.stringify(settings.maxResultsOptions) !== JSON.stringify([0])) {
      failure = "Expected maxResultsOptions == [0]. Got maxResultsOptions == " + settings.maxResultsOptions
    } else if (settings.langCode !== "en") {
      failure = "Expected langCode == 'en'. Got langCode == " + settings.langCode
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
    cut = "SettingsModel.setNumCities()"
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
    cut = "SettingsModel.setMaxResults()"
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
    cut = "SettingsModel.setLangCode()"
    console.log(' Verifying ability to set langCode ...')
    settings.setLangCode("en")
    let langCode = settings.getLangCode()
    if (langCode !== "en") {
      failure = "Unable to set/get langCode.  Expected to get 'en'.  Got langCode == " + langCode
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
    cut = "SettingsModel.setCountryCode()"
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
    cut = "SettingsModel.getMaxResultsOptions()"
    console.log(' Verifying ability to get maxResultsOptions array ...')
    settings = new SettingsModel(178)
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
    cut = "SettingsModel(ctor) negative case"
    console.log(' Verifying fallback to default values on invalid ctor params ...')
    let badMaxResults = "i should be a number"
    let badLangCode = "bd"
    let badCountryCode = "BD"
    settings = new SettingsModel(178, badMaxResults, badLangCode, badCountryCode)
    if (settings.maxResults !== settings.dfltMaxResults) {
      failure = "Expected maxResults == " + settings.dfltMaxResults + " Got maxResults == " + settings.maxResults
    }
    if (settings.langCode !== settings.dfltLangCode) {
      failure += "\nExpected langCode == " + settings.dfltLangCode + " Got langCode == " + settings.countryCode
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
    cut = "SettingsModel.getLangName(langCode) positive case"
    console.log(' Verifying ability to fetch a language name given a iso lang code ...')
    let langName = settings.getLangName("en")
    if (langName !== "English") {
      failure = "Expected langName == 'English'" + " Got " + langName
    }
    langName = settings.getLangName("es")
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
    cut = "SettingsModel.getLangName(langCode) negative case"
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
    settings = new SettingsModel(178, 10, "en", "US")
    cut = "SettingsModel.getCountryName(countryCode), *.getLocale(), *.getCurrency()  positive case"
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
    cut = "SettingsModel.getCountryName(countryCode) negative case"
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
