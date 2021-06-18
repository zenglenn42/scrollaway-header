function SettingsModel(numCities, maxResults, langCode, countryCode) {

  // Number of cities in the database for the country indicated by countryCode.

  this.dfltNumCities = 0
  this.numCities = (this.isValidNumCities(numCities)) ? numCities : this.dfltNumCities

  // Number of cities to present as "best bests" in the results view.

  this.dfltMaxResults = Math.min(this.numCities, 10)
  this.maxResults = (this.isValidMaxResults(maxResults)) ? maxResults : this.dfltMaxResults

  // Populates drop-down selection list in view.

  this.dfltMaxResultsOptions = [5, 10, 20] 
  this.maxResultsOptions = [this.maxResults]
  if (this.isValidNumCities(numCities) && numCities >= 20) {
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
    },
    "es": {
      name: "Español",
      enName: "Spanish",
      grayOut: true  // Visible in UI but not selectable.
    }
  }

  // Select from among these (ISO 3166) countries when looking for a city match.
  // Populates drop-down selection list in view.

  this.dfltCountryCode = "US"
  this.countryCode = (this.isValidCountryCode(countryCode)) ? countryCode : this.dfltCountryCode
  this.countryOptionsMap = {
    "US": {
      name: "United States",
    },
    "CR": {
      name: "Costa Rica",
      grayOut: true  // Visible in UI but not selectable.
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
  return this.maxResultsOptions
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
      failure += "\nExpected langCode == " + settings.dfltLangCode + " Got langCode == " + settings.langCode
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

}
