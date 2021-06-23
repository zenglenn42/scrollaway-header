function PrioritiesModel(affordabilityValue, 
                         happinessValue, 
                         politicsValue, 
                         affordabilityRange, 
                         happinessRange, 
                         affordabilityEnabled, 
                         happinessEnabled, 
                         politicsEnabled, 
                         jobSearchEnabled) {

  if (!this.isValidRange(affordabilityRange)) {
    throw('PriorityModel: Failed constructor.  Invalid affordabilityRange input parameter')
  }
  if (!this.isValidRange(happinessRange)) {
    throw('PriorityModel: Failed constructor.  Invalid happinessRange input parameter')
  }
  
  this.dfltAffordabilityValue = Math.round((affordabilityRange.min + affordabilityRange.max) / 2)
  this.dfltHappinessValue = Math.round((happinessRange.min + happinessRange.max) / 2)
  this.dfltPoliticsValue = { rep16_frac: 50, dem16_frac: 50 }

  this.affordabilityRange = affordabilityRange
  this.affordabilityValue = this.isValidAffordabilityValue(affordabilityValue, this.affordabilityRange) ? 
                              affordabilityValue : this.dfltAffordabilityValue

  this.happinessRange = happinessRange
  this.happinessRange = this.isValidRange(happinessRange) ? happinessRange : this.dfltRange
  this.happinessValue = this.isValidHappinessValue(happinessValue, this.happinessRange) ? 
                              happinessValue : this.dfltHappinessValue

  this.politicsRange = {min: 0, max: 100}  // Expressed as percentage.
  this.politicsValue = this.isValidPoliticsValue(politicsValue, this.politicsRange) ? politicsValue : this.dfltPoliticsValue

  this.dfltAffordabilityEnabled = true
  this.dfltHappinessEnabled = true
  this.dfltPoliticsEnabled = true

  this.affordabilityEnabled = this.isBoolean(affordabilityEnabled) ? affordabilityEnabled : this.dfltAffordabilityEnabled
  this.happinessEnabled = this.isBoolean(happinessEnabled) ? happinessEnabled : this.dfltHappinessEnabled
  this.politicsEnabled = this.isBoolean(politicsEnabled) ? politicsEnabled : this.dfltPoliticsEnabled

  // TODO: Add support for this Feature.  Perpetually disabled for now.
  this.dfltJobSearchEnabled = false
  this.jobSearchEnabled = this.isBoolean(jobSearchEnabled) ? false : false
}

PrioritiesModel.prototype.restoreDefaults = function() {
  this.affordabilityValue = this.dfltAffordabilityValue
  this.happinessValue = this.dfltHappinessValue
  this.politicsValue = this.dfltPoliticsValue
  this.affordabilityEnabled = this.dfltAffordabilityEnabled
  this.happinessEnabled = this.dfltHappinessEnabled
  this.politicsEnabled = this.dfltPoliticsEnabled
  this.jobSearchEnabled = this.dfltJobSearchEnabled
};

PrioritiesModel.prototype.isValidRange = function(range) {
  if (!range) return false
  return range.hasOwnProperty('min') && range.hasOwnProperty('max') && (typeof range.min === 'number') && (typeof range.max === 'number')
}

PrioritiesModel.prototype.isBoolean = function(value) {
  if (value === undefined) return false
  return (value === true || value === false)
}

PrioritiesModel.prototype.isValidAffordabilityValue = function(value, range) {
  let isNum = (typeof value === 'number')
  return (this.isValidRange(range) && isNum && Number.isInteger(value) && (value >= range.min && value <= range.max))
}

PrioritiesModel.prototype.isValidHappinessValue = function(value, range) {
  let isNum = (typeof value === 'number')
  return (this.isValidRange(range) && isNum && Number.isInteger(value) && (value >= range.min && value <= range.max))
}

PrioritiesModel.prototype.isValidPoliticsValue = function(value, range) {
  let isObject = (typeof value) === 'object'
  return (this.isValidRange(range) && 
          isObject && 
          value.hasOwnProperty('rep16_frac') && 
          value.hasOwnProperty('dem16_frac') && 
          (typeof value.rep16_frac) === 'number' && 
          (typeof value.dem16_frac) === 'number' && 
          (value.rep16_frac >= range.min && value.rep16_frac <= range.max) &&
          (value.dem16_frac >= range.min && value.dem16_frac <= range.max) &&
          (value.rep16_frac + value.dem16_frac <= range.max))
}


PrioritiesModel.prototype.getAffordabilityValue = function() {
  return this.affordabilityValue
};

PrioritiesModel.prototype.setAffordabilityValue = function(value) {
  let result = false;
  if (this.isValidAffordabilityValue(value, this.affordabilityRange)) {
    this.affordabilityValue = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setAffordabilityValue.  Ignoring invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getHappinessValue = function() {
  return this.happinessValue
};

PrioritiesModel.prototype.setHappinessValue = function(value) {
  let result = false;
  if (this.isValidHappinessValue(value, this.happinessRange)) {
    this.happinessValue = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setHappinessValue.  Invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getPoliticsValue = function() {
  return this.politicsValue
};

PrioritiesModel.prototype.setPoliticsValue = function(value) {
  let result = false;
  if (this.isValidPoliticsValue(value, this.politicsRange)) {
    this.politicsValue = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setPoliticsValue.  Invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getAffordabilityEnabled = function() {
  return this.affordabilityEnabled
};

PrioritiesModel.prototype.setAffordabilityEnabled = function(value) {
  let result = false;
  if (this.isBoolean(value)) {
    this.affordabilityEnabled = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setAffordabilityEnabled.  Invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getHappinessEnabled = function() {
  return this.happinessEnabled
};

PrioritiesModel.prototype.setHappinessEnabled = function(value) {
  let result = false;
  if (this.isBoolean(value)) {
    this.happinessEnabled = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setHappinessEnabled.  Invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getPoliticsEnabled = function() {
  return this.politicsEnabled
};

PrioritiesModel.prototype.setPoliticsEnabled = function(value) {
  let result = false;
  if (this.isBoolean(value)) {
    this.politicsEnabled = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setPoliticsEnabled.  Invalid value:', value)
  }
  return result
};

PrioritiesModel.prototype.getJobSearchEnabled = function() {
  return this.jobSearchEnabled
};

PrioritiesModel.prototype.setJobSearchEnabled = function(value) {
  let result = false;
  console.log('[Info] PrioritiesModel.setJobSearchEnabled. Feature disabled. Ignoring request.')
  /* TODO: Re-enable this once this feature is supported.
  if (this.isBoolean(value)) {
    this.jobSearchEnabled = value
    result = true
  } else {
    console.log('[Info] PrioritiesModel.setJobSearchEnabled.  Invalid value:', value)
  }
  */
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

function UnitTestPrioritiesModel() {
  let cut = ""
  let failure = ""
  let errmsg = undefined
  let module = "priorities-model.js"

  console.log('Starting unit tests for ' + module)
  console.log('----------------------------------------')

  console.log(' Instantiating priorities model object ...')

  let testAffordability = 100000
  let testHappiness = 50
  let testPolitics = { rep16_frac: 40, dem16_frac: 60 }
  let testAffordabilityRange = {min: 82500, max: 927400}
  let testHappinessRange = {min: 29, max: 73}
  let testAffordabilityEnabled = true
  let testHappinessEnabled = true
  let testPoliticsEnabled = true
  let testJobSearchEnabled = true

  let priorities = new PrioritiesModel(
                          testAffordability, 
                          testHappiness, 
                          testPolitics,
                          testAffordabilityRange,
                          testHappinessRange,
                          testAffordabilityEnabled, 
                          testHappinessEnabled, 
                          testPoliticsEnabled, 
                          testJobSearchEnabled)

  // Test #1
  try {
    cut = "PrioritiesModel(ctor)"
    console.log(' Verifying object construction ...')

    if (priorities.affordabilityValue !== testAffordability) {
      failure = "Expected affordabilityValue == " + testAffordability + "  Got " + priorities.affordabilityValue
    } else if (priorities.happinessValue !== testHappiness) {
      failure = "Expected happinessValue == " + testHappiness + "  Got " + priorities.happinessValue
    } else if (JSON.stringify(priorities.politicsValue) !== JSON.stringify(testPolitics)) {
      failure = "Expected politicsValue == " + JSON.stringify(testPolitics) + "  Got " + JSON.stringify(priorities.politicsValue)
    } else if (JSON.stringify(priorities.affordabilityRange) !== JSON.stringify(testAffordabilityRange)) {
      failure = "Expected affordabilityRange == " + JSON.stringify(testAffordabilityRange) + "  Got " + JSON.stringify(priorities.affordabilityRange)
    } else if (JSON.stringify(priorities.happinessRange) !== JSON.stringify(testHappinessRange)) {
      failure = "Expected happinessRange == " + JSON.stringify(testHappinessRange) + "  Got " + JSON.stringify(priorities.happinessRange)
    } else if (priorities.affordabilityEnabled !== testAffordabilityEnabled) {
      failure = "Expected affordabilityEnabled == " + testAffordabilityEnabled + "  Got " + priorities.affordabilityEnabled
    } else if (priorities.happinessEnabled !== testHappinessEnabled) {
      failure = "Expected happinessEnabled == " + testHappinessEnabled + "  Got " + priorities.happinessEnabled
    } else if (priorities.politicsEnabled !== testPoliticsEnabled) {
      failure = "Expected politicsEnabled == " + testPoliticsEnabled + "  Got " + priorities.politicsEnabled
    //} else if (priorities.jobSearchEnabled !== testJobSearchEnabled) {
    } else if (priorities.jobSearchEnabled !== false) {
      failure = "Expected jobSearchEnabled == " + testJobSearchEnabled + "  Got " + priorities.jobSearchEnabled
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
  failure = ""
  try {
    cut = "PrioritiesModel.isValidRange()"

    console.log(' Verifying we can detect well-formed range objects ...')
    let goodRange = {min: 0, max: 100}
    if (!priorities.isValidRange(goodRange)) {
      failure = "Expected to pass with " + JSON.stringify(goodRange) + " but failed.\n"
    } 

    console.log(' Verifying we can detect range object with non-numeric value ...')
    let badRange1 = {min: 2, max: '3'}
    if (priorities.isValidRange(badRange1)) {
      failure += "Expected to fail on non-numeric max value, but passed with " + JSON.stringify(badRange1) + "\n"
    } 

    console.log(' Verifying we can detect range object with missing property ...')
    let badRange2 = {min: 2, madMax: 3}
    if (priorities.isValidRange(badRange2)) {
      failure += "Expected to fail on missing 'max' property, but passed with " + JSON.stringify(badRange2) + "\n"
    } 

    console.log(' Verifying we can detect missing/undefined range ...')
    let badRange3 = undefined
    if (priorities.isValidRange(badRange3)) {
      failure += "Expected to fail on undefined range, but passed"
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
  failure = ""
  try {
    cut = "PrioritiesModel.isBoolean()"
    console.log(' Verifying we can detect boolean parameters ...')

    if (!priorities.isBoolean(true)) {
      failure = "Expected to pass with 'true' but failed\n"
    } 
    if (!priorities.isBoolean(false)) {
      failure = "Expected to pass with 'false' but failed\n"
    } 
    if (priorities.isBoolean('bogus-string')) {
      failure = "Expected to fail with 'bogus-string' but passed\n"
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
  failure = ""
  try {
    cut = "PrioritiesModel.isValidAffordabilityValue()"

    console.log(' Verifying we can detect valid affordability values ...')
    //testAffordabilityRange = {min: 82500, max: 927400}
    let badValue1 = '500000' // should be a number, not a string
    if (priorities.isValidAffordabilityValue(badValue1, testAffordabilityRange)) {
      failure = "Expected to fail with string value but passed with " + badValue1 + "\n"
    } 

    console.log(' Verifying we can detect out of range minimum ...')
    let badValue2 = 82499 // out of range minimum
    if (priorities.isValidAffordabilityValue(badValue2, testAffordabilityRange)) {
      failure += "Expected to fail with out of range minimum but passed with " + badValue2 + "\n"
    } 

    console.log(' Verifying we can detect out of range maximum ...')
    let badValue3 = 927401 // out of range maximum
    if (priorities.isValidAffordabilityValue(badValue3, testAffordabilityRange)) {
      failure += "Expected to fail with out of range maximum but passed with " + badValue3 + "\n"
    } 

    console.log(' Verifying we can detect boundary minimum ...')
    let goodValue1 = 82500
    if (!priorities.isValidAffordabilityValue(goodValue1, testAffordabilityRange)) {
      failure += "Expected to pass with boundary minimum, but failed with " + goodValue1 + "\n"
    } 

    console.log(' Verifying we can detect boundary maximum ...')
    let goodValue2 = 927400
    if (!priorities.isValidAffordabilityValue(goodValue2, testAffordabilityRange)) {
      failure += "Expected to pass with boundary maximum, but failed with " + goodValue2 + "\n"
    } 

    console.log(' Verifying we can detect middling value ...')
    let goodValue3 = 500000
    if (!priorities.isValidAffordabilityValue(goodValue3, testAffordabilityRange)) {
      failure += "Expected to pass with middling value, but failed with " + goodValue3 
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
  failure = ""
  try {
    cut = "PrioritiesModel.isValidHappinessValue()"

    //testHappinessRange = {min: 29, max: 73}

    console.log(' Verifying we can detect invalid happiness type ...')
    let badValue1 = '50' // should be a number, not a string
    if (priorities.isValidHappinessValue(badValue1, testHappinessRange)) {
      failure = "Expected to fail with string value but passed with " + badValue1 + "\n"
    } 

    console.log(' Verifying we can detect out of range minimum ...')
    let badValue2 = 28 // out of range minimum
    if (priorities.isValidHappinessValue(badValue2, testHappinessRange)) {
      failure += "Expected to fail with out of range minimum but passed with " + badValue2 + "\n"
    } 

    console.log(' Verifying we can detect out of range maximum ...')
    let badValue3 = 74 // out of range maximum
    if (priorities.isValidHappinessValue(badValue3, testHappinessRange)) {
      failure += "Expected to fail with out of range maximum but passed with " + badValue3 + "\n"
    } 

    console.log(' Verifying we can detect boundary minimum ...')
    let goodValue1 = 29
    if (!priorities.isValidHappinessValue(goodValue1, testHappinessRange)) {
      failure += "Expected to pass with boundary minimum, but failed with " + goodValue1 + "\n"
    } 

    console.log(' Verifying we can detect boundary maximum ...')
    let goodValue2 = 73
    if (!priorities.isValidHappinessValue(goodValue2, testHappinessRange)) {
      failure += "Expected to pass with boundary maximum, but failed with " + goodValue2 + "\n"
    } 

    console.log(' Verifying we can detect middling value ...')
    let goodValue3 = 42
    if (!priorities.isValidHappinessValue(goodValue3, testHappinessRange)) {
      failure += "Expected to pass with middling value, but failed with " + goodValue3 
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
  failure = ""
  try {
    cut = "PrioritiesModel.isValidPoliticsValue()"
    // typical politics value = { rep16_frac: 50, dem16_frac: 50 }
    let testPoliticsRange = {min: 0, max: 100}

    console.log(' Verifying we can detect invalid politics object ...')
    let badValue1 = { bogus_frac: 50, dem16_frac: 50 } // bad property name, should be rep16_frac
    if (priorities.isValidPoliticsValue(badValue1, testPoliticsRange)) {
      failure = "Expected to fail with bad property name but passed with " + JSON.stringify(badValue1) + "\n"
    } 

    console.log(' Verifying we can detect out of range minimum ...')
    let badValue2 = { rep16_frac: -1, dem16_frac: 50 } // out of range minimum
    if (priorities.isValidPoliticsValue(badValue2, testPoliticsRange)) {
      failure += "Expected to fail with out of range minimum but passed with " + badValue2 + "\n"
    } 

    console.log(' Verifying we can detect out of range maximum ...')
    let badValue3 = { rep16_frac: 0, dem16_frac: 101 } // out of range maximum
    if (priorities.isValidPoliticsValue(badValue3, testPoliticsRange)) {
      failure += "Expected to fail with out of range maximum but passed with " + badValue3 + "\n"
    } 

    console.log(' Verifying we can detect boundary minimum ...')
    let goodValue1 = { rep16_frac: 0, dem16_frac: 0 }
    if (!priorities.isValidPoliticsValue(goodValue1, testPoliticsRange)) {
      failure += "Expected to pass with boundary minimum, but failed with " + goodValue1 + "\n"
    } 

    console.log(' Verifying we can detect boundary maximum ...')
    let goodValue2 = { rep16_frac: 100, dem16_frac: 0 }
    if (!priorities.isValidPoliticsValue(goodValue2, testPoliticsRange)) {
      failure += "Expected to pass with boundary maximum, but failed with " + goodValue2 + "\n"
    } 

    console.log(' Verifying we fail for sum value > 100% ...')
    let badValue4 = { rep16_frac: 50, dem16_frac: 51 }
    if (priorities.isValidPoliticsValue(badValue4, testPoliticsRange)) {
      failure += "Expected to fail with total percentage > 100% but passed with " + JSON.stringify(badValue4) + "\n"
    } 

    console.log(' Verifying we pass with nominal value ...')
    let goodValue3 = { rep16_frac: 25, dem16_frac: 42 }
    if (!priorities.isValidPoliticsValue(goodValue3, testPoliticsRange)) {
      failure += "Expected to pass with nominal value, but failed with " + JSON.stringify(goodValue3)
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
  failure = ""
  try {
    cut = "PrioritiesModel.getAffordabilityValue() / *.setAffordabilityValue()"
    // affordabilityValue: 100000

    console.log(' Verifying we can get affordabilityValue ...')
    let testValue = priorities.getAffordabilityValue()
    if (testValue !== priorities.affordabilityValue) {
      failure = "Expected to get " + priorities.affordabilityValue + " but got " + testValue + "\n"
    } 

    console.log(' Verifying we can set / get affordabilityValue ...')
    testValue = 100001
    if (!priorities.setAffordabilityValue(testValue) || priorities.getAffordabilityValue() !== testValue) {
      failure = "Expected to set affordabilityValue to 100001 but got " + priorities.affordabilityValue + "\n"
    }

    console.log(' Verifying we cannot set affordabilityValue to something invalid...')
    let badValue = -1
    if (priorities.setAffordabilityValue(badValue)) {
      failure = "Expected to fail when setting affordabilityValue to an invalid number, but passed with " + priorities.affordabilityValue + "\n"
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
  failure = ""
  try {
    cut = "PrioritiesModel.getHappinessValue() / *.setHappinessValue()"
  
    // happinessValue: 50

    console.log(' Verifying we can get happinessValue ...')
    let testValue = priorities.getHappinessValue()
    if (testValue !== priorities.happinessValue) {
      failure = "Expected to get " + priorities.happinessValue + " but got " + testValue + "\n"
    } 

    console.log(' Verifying we can set / get happinessValue ...')
    testValue = 51
    if (!priorities.setHappinessValue(testValue) || priorities.getHappinessValue() !== testValue) {
      failure = "Expected to set happinessValue to 51 but got " + priorities.happinessValue + "\n"
    }

    console.log(' Verifying we cannot set happinessValue to something invalid...')
    let badValue = 28
    if (priorities.setHappinessValue(badValue)) {
      failure = "Expected to fail when setting happinessValue to out-of-range minimum number, but passed with " + priorities.happinessValue + "\n"
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
  failure = ""
  try {
    cut = "PrioritiesModel.getPoliticsValue() / *.setPoliticsValue()"
    // politicsValue: { dem16_frac: 60, rep16_frac: 40 }

    console.log(' Verifying we can get politicsValue ...')
    let testValue = priorities.getPoliticsValue()
    if (JSON.stringify(testValue) !== JSON.stringify(priorities.politicsValue)) {
      failure = "Expected to get " + JSON.stringify(priorities.politicsValue) + " but got " + JSON.stringify(testValue) + "\n"
    } 

    console.log(' Verifying we can set / get politicsValue ...')
    testValue = { dem16_frac: 59, rep16_frac: 39 }
    if (!priorities.setPoliticsValue(testValue) || priorities.getPoliticsValue() !== testValue) {
      failure = "Expected to set politicsValue to " + JSON.stringify(testValue) + " but got " + JSON.stringify(priorities.politicsValue) + "\n"
    }

    console.log(' Verifying we cannot set politicsValue to something invalid...')
    let badValue = { dem16_frac: 51, rep16_frac: 51 }
    if (priorities.setPoliticsValue(badValue)) {
      failure = "Expected to fail when setting politicsValue to > 100% sum, but passed with " + priorities.politicsValue + "\n"
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
  failure = ""
  try {
    cut = "PrioritiesModel.getAffordabilityEnabled() / *.setAffordabilityEnabled()"
    // affordabilityEnabled: true

    console.log(' Verifying we can get affordabilityEnabled ...')
    let testValue = priorities.getAffordabilityEnabled()
    if (testValue !== priorities.affordabilityEnabled) {
      failure = "Expected to get " + JSON.stringify(priorities.affordabilityEnabled) + " but got " + JSON.stringify(testValue) + "\n"
    } 

    console.log(' Verifying we can set / get affordabilityEnabled ...')
    testValue = false
    if (!priorities.setAffordabilityEnabled(testValue) || priorities.getAffordabilityEnabled() !== testValue) {
      failure = "Expected to set affordabilityEnabled to " + JSON.stringify(testValue) + " but got " + JSON.stringify(priorities.affordabilityEnabled) + "\n"
    }

    console.log(' Verifying we cannot set affordabilityEnabled to something invalid...')
    let badValue = 'bogus_boolean'
    if (priorities.setAffordabilityEnabled(badValue)) {
      failure = "Expected to fail when setting affordabilityEnabled to something bogus but passed with " + priorities.affordabilityEnabled + "\n"
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
  failure = ""
  try {
    cut = "PrioritiesModel.getHappinessEnabled() / *.setHappinessEnabled()"
    // happinessEnabled: true

    console.log(' Verifying we can get happinessEnabled ...')
    let testValue = priorities.getHappinessEnabled()
    if (testValue !== priorities.happinessEnabled) {
      failure = "Expected to get " + JSON.stringify(priorities.happinessEnabled) + " but got " + JSON.stringify(testValue) + "\n"
    } 

    console.log(' Verifying we can set / get happinessEnabled ...')
    testValue = false
    if (!priorities.setHappinessEnabled(testValue) || priorities.getHappinessEnabled() !== testValue) {
      failure = "Expected to set happinessEnabled to " + JSON.stringify(testValue) + " but got " + JSON.stringify(priorities.happinessEnabled) + "\n"
    }

    console.log(' Verifying we cannot set happinessEnabled to something invalid...')
    let badValue = 'bogus_boolean'
    if (priorities.setHappinessEnabled(badValue)) {
      failure = "Expected to fail when setting happinessEnabled to something bogus but passed with " + priorities.happinessEnabled + "\n"
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #12
  failure = ""
  try {
    cut = "PrioritiesModel.getPoliticsEnabled() / *.setPoliticsEnabled()"
    // politicsEnabled: true

    console.log(' Verifying we can get politicsEnabled ...')
    let testValue = priorities.getPoliticsEnabled()
    if (testValue !== priorities.politicsEnabled) {
      failure = "Expected to get " + JSON.stringify(priorities.politicsEnabled) + " but got " + JSON.stringify(testValue) + "\n"
    } 

    console.log(' Verifying we can set / get politicsEnabled ...')
    testValue = false
    if (!priorities.setPoliticsEnabled(testValue) || priorities.getPoliticsEnabled() !== testValue) {
      failure = "Expected to set politicsEnabled to " + JSON.stringify(testValue) + " but got " + JSON.stringify(priorities.politicsEnabled) + "\n"
    }

    console.log(' Verifying we cannot set politicsEnabled to something invalid...')
    let badValue = 'bogus_boolean'
    if (priorities.setPoliticsEnabled(badValue)) {
      failure = "Expected to fail when setting politicsEnabled to something bogus but passed with " + priorities.politicsEnabled + "\n"
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #13
  failure = ""
  try {
    cut = "PrioritiesModel.getJobSearchEnabled() / *.setJobSearchEnabled()"
    // jobSearchEnabled: false

    console.log(' Verifying we can get jobSearchEnabled ...')
    let testValue = priorities.getJobSearchEnabled()
    if (testValue !== priorities.jobSearchEnabled) {
      failure = "Expected to get " + JSON.stringify(priorities.jobSearchEnabled) + " but got " + JSON.stringify(testValue) + "\n"
    } 

    console.log(' Verifying we cannot set TDB feature jobSearchEnabled ...')
    testValue = true
    if (priorities.setJobSearchEnabled(testValue) || priorities.getJobSearchEnabled() === testValue) {
      failure = "Expected to fail setting TBD feature jobSearchEnabled to " + JSON.stringify(testValue) + " but got " + JSON.stringify(priorities.jobSearchEnabled) + "\n"
    }

    /*
    console.log(' Verifying we cannot set jobSearchEnabled to something invalid...')
    let badValue = 'bogus_boolean'
    if (priorities.setJobSearchEnabled(badValue)) {
      failure = "Expected to fail when setting jobSearchEnabled to something bogus but passed with " + priorities.jobSearchEnabled + "\n"
    }
    */

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  // Test #14
  failure = ""
  try {
    cut = "PrioritiesModel(ctor) negative case"
    console.log(' Verifying object construction failure on bad affordability range input parameter ...')

    let failedPriorities = new PrioritiesModel(
                          testAffordability,
                          testHappiness,
                          testPolitics,
                          'bogus_affordability_range',
                          testHappinessRange,
                          testAffordabilityEnabled,
                          testHappinessEnabled,
                          testPoliticsEnabled,
                          testJobSearchEnabled)

    failure = "Expected to fail with affordabilityRange = 'bogus_affordability_range', but passed."
    throw(mkFailMsg(cut, failure))
  } catch(e) {
    let expectedError = "PriorityModel: Failed constructor.  Invalid affordabilityRange input parameter"
    if (e !== expectedError) {
      failure = "Expected to catch constructor error: \n"
      failure += "         " + expectedError + "\n"
      failure += "  got: " + e + "\n"
      throw(mkFailMsg(cut, failure))
    } 
    console.log(mkPassMsg(cut))
  }

  // Test #15
  failure = ""
  try {
    cut = "PrioritiesModel(ctor) negative case"
    console.log(' Verifying object construction failure on bad happiness range input parameter ...')

    let failedPriorities = new PrioritiesModel(
                          testAffordability,
                          testHappiness,
                          testPolitics,
                          testAffordabilityRange,
                          'bogus_happiness_range',
                          testAffordabilityEnabled,
                          testHappinessEnabled,
                          testPoliticsEnabled,
                          testJobSearchEnabled)

    failure = "Expected to fail with happinessRange = 'bogus_happiness_range', but passed."
    throw(mkFailMsg(cut, failure))
  } catch(e) {
    let expectedError = "PriorityModel: Failed constructor.  Invalid happinessRange input parameter"
    if (e !== expectedError) {
      failure = "Expected to catch constructor error: \n"
      failure += "         " + expectedError + "\n"
      failure += "  got: " + e + "\n"
      throw(mkFailMsg(cut, failure))
    } 
    console.log(mkPassMsg(cut))
  }

  // Test #16
  failure = ""
  try {
    cut = "PrioritiesModel.restoreDefaults()"
    console.log(' Verifying ability to reset a priorities model object to a default state ...')

    let testAffordability = priorities.dfltAffordabilityValue
    let testHappiness = priorities.dfltHappinessValue
    let testPolitics = priorities.dfltPoliticsValue
    let testAffordabilityRange = {min: 82500, max: 927400}
    let testHappinessRange = {min: 29, max: 73}
    let testAffordabilityEnabled = priorities.dfltAffordabilityEnabled
    let testHappinessEnabled = priorities.dfltAffordabilityEnabled
    let testPoliticsEnabled = priorities.dfltPoliticsEnabled
    let testJobSearchEnabled = priorities.dfltJobSearchEnabled

    let dfltPriorities = new PrioritiesModel(
                           testAffordability, 
                           testHappiness, 
                           testPolitics,
                           testAffordabilityRange,
                           testHappinessRange,
                           testAffordabilityEnabled, 
                           testHappinessEnabled, 
                           testPoliticsEnabled, 
                           testJobSearchEnabled)

    priorities.restoreDefaults()

    if (JSON.stringify(dfltPriorities) !== JSON.stringify(priorities)) {
      failure = "Unable to reset priority model to default state.\n"
      failure += "Expecting " + JSON.stringify(dfltPriorities) + "\n"
      failure += "Got       " + JSON.stringify(priorities) + "\n"
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
