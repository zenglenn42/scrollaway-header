//----------------------------------------------------------------------------------
// LocalPersistence
//
// This class manages the persistence of view models on the client machine.
//
// It basically wrappers the DOM's localStorage API but adds some modest
// validation.  It provides a level of indirection should we elect to use
// something else to persist the view models locally in the future.
//----------------------------------------------------------------------------------

function LocalPersistence() {
  this._SETTINGS_KEY = 'settings'
  this._PRIORITIES_KEY = 'priorities'

  this.settings = this.get(this._SETTINGS_KEY)
  this.priorities = this.get(this._PRIORITIES_KEY)
}

LocalPersistence.prototype.hasLocalStorage = function() {
  // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
  let test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

LocalPersistence.prototype.hasAppDataCB = function() {
  return this.hasAppData
}

LocalPersistence.prototype.hasAppData = function() {
  return this.hasSettings() || this.hasPriorities()
}

LocalPersistence.prototype.hasSettingsCB = function() {
  return this.hasSettings
}

LocalPersistence.prototype.hasSettings = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._SETTINGS_KEY)
  }
  return value
}

LocalPersistence.prototype.hasPrioritiesCB = function() {
  return this.hasPriorities
}

LocalPersistence.prototype.hasPriorities = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._PRIORITIES_KEY)
  }
  return value
}

LocalPersistence.prototype.isValidKey = function(key) {
  return (key === this._SETTINGS_KEY || key === this._PRIORITIES_KEY)
}

LocalPersistence.prototype.get = function(key) {
  let localValue = undefined
  const badEncoding = "[object Object]" // This happens if an object is inadequately encoded during setItem.
                                        // Used to prevent exception if JSON.parse attempts to decode as an array.

  if (this.isValidKey(key)) {
    let localValueStr = localStorage.getItem(key)
    if (localValueStr) {
      localValue = (localValueStr !== badEncoding) ? JSON.parse(localValueStr) : localValue
    }
  }
  return localValue
}

LocalPersistence.prototype.set = function(key, value) {
  let result = undefined

  if (this.isValidKey(key)) {
    try {
      let valueStr = JSON.stringify(value)
      localStorage.setItem(key, valueStr);
      result = true
    } catch(e) {
      result = false
    }
  }
  return result
}

LocalPersistence.prototype.clearSettings = function() {
  return this.clear(this._SETTINGS_KEY)
}

LocalPersistence.prototype.clearPriorities = function() {
  return this.clear(this._PRIORITIES_KEY)
}

LocalPersistence.prototype.clear = function(localKey) {
  let result = false

  try {
    if (localKey) {
      if (this.isValidKey(localKey)) {
        localStorage.removeItem(localKey)
        result = true
      }
    } else {
      localStorage.clear();
      result = true
    }
  } catch(e) {
    let arg = (localKey) ? localKey : ''
    console.log('LocalPersistence.clear(' + arg + ') failed.')
  }
  return result
}

//----------------------------------------------------------------------------------
// Unit Test
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
function mkFailMsg(codeUnderTest, failStr) {
  let failMsg = `  [fail] ${codeUnderTest} \n  ${failStr}`
  return failMsg
}

//----------------------------------------------------------------------------------
function mkPassMsg(codeUnderTest, iterations) {
  let passMsg = ` [pass] ${codeUnderTest}`
  if (iterations) {
    passMsg += ` (${iterations} iterations)`
  }
  return passMsg
}

function UnitTestLocalPersistence() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "local-persistence.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')
  console.log(' Instantiating local persistence object ...')
  let cache = new LocalPersistence();

  console.log(' Clearing any previously persisted app data ...')
  cache.clear()

  // Test #1
  try {
    cut = "LocalPersistence.hasLocalStorage()"
    console.log(' Verifying client browser supports local storage ...')
    if (!cache.hasLocalStorage()) {
      failure = "Unable to write and read a test object to local storage."
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
    cut = "LocalPersistence(ctor)"
    console.log(' Verifying constants ...')

    if (cache._SETTINGS_KEY !== 'settings') {
      failure = "Expecting cache.SETTINGS === 'settings'"
    }
    if (cache._PRIORITIES_KEY !== 'priorities') {
      failure += "\n Expecting cache.PRIORITIES === 'priorities'"
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
    cut = "LocalPersistence.hasAppData()"
    console.log(' Verifying no app data is persisted ...')
    if (cache.hasAppData()) {
      failure = "Expecting no persisted app data but found some."
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
    cut = "LocalPersistence.isValidKey()"
    console.log(' Verifying key validation (positive case) ...')
    if (!cache.isValidKey(cache._SETTINGS_KEY) || 
        !cache.isValidKey(cache._PRIORITIES_KEY)) {
      failure = "Unable to validate what should be one or more valid keys."
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
    cut = "LocalPersistence.isValidKey()"
    console.log(' Verifying key validation (negative case) ...')
    if (cache.isValidKey('bogusKey')) {
      failure = "Validated a bogus key. :-/"
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
    cut = "LocalPersistence.set()"
    console.log(' Verifying ability to store a key/value pair ...')
    let key = 'settings'
    let value = {maxResults: 10, country: 'United States', lang: 'en-US'}

    if (!cache.set(key, value)) {
      failure = "Unable to persist key:value = " + key + ":" + JSON.stringify(value)
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
    cut = "LocalPersistence.get()"
    console.log(' Verifying ability to retrieve a persisted value with a key ...')
    let key = 'settings'
    let value = {maxResults: 10, country: 'United States', lang: 'en-US'}
    let expectedValueStr = JSON.stringify(value)

    let actualValueStr = JSON.stringify(cache.get(key))

    if (actualValueStr !== expectedValueStr) {
      failure = "Retrieved value does not match expected value."
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

  console.log('---------------------------------------')
  console.log('Leaving unit tests for ' + module)
}
