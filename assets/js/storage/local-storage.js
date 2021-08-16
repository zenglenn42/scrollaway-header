//----------------------------------------------------------------------------------
// LocalStorage
//
// This class manages the storage of view model state on the client machine.
//
// It wrappers the DOM's localStorage API, adding some modest validation.
// It provides a level of indirection should we elect to use something else to 
// persist local state in the future.
//----------------------------------------------------------------------------------

function LocalStorage() {
  this._SETTINGS_KEY = 'settings'     // TODO: Some day I'll be a proper enum.
  this._PRIORITIES_KEY = 'priorities' //       Me too.
  this._FAB_KEY = 'fab'               //       Me too.
}

LocalStorage.prototype.hasLocalStorage = function() {
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

LocalStorage.prototype.hasAppData = function() {
  return this.hasAppData
}

LocalStorage.prototype.hasAppData = function() {
  return this.hasSettings() || this.hasPriorities() || this.hasFAB()
}

LocalStorage.prototype.hasSettings = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._SETTINGS_KEY)
  }
  return value
}

LocalStorage.prototype.hasPriorities = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._PRIORITIES_KEY)
  }
  return value
}

LocalStorage.prototype.hasFAB = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._FAB_KEY)
  }
  return value
}

LocalStorage.prototype.hasResults = function() {
  let value = undefined
  if (this.hasLocalStorage()) {
    value = localStorage.getItem(this._RESULTS_KEY)
  }
  return value
}

LocalStorage.prototype.isValidKey = function(key) {
  return (key === this._SETTINGS_KEY   ||
          key === this._PRIORITIES_KEY ||
          key === this._FAB_KEY        ||
          key === this._RESULTS_KEY)
}

LocalStorage.prototype.get = function(key) {
  let localValue = undefined
  const badEncoding = "[object Object]" // This happens if an object is inadequately
                                        // encoded during setItem. Used to prevent exception
                                        // if JSON.parse attempts to decode as an array.

  if (this.isValidKey(key)) {
    let localValueStr = localStorage.getItem(key)
    if (localValueStr) {
      localValue = (localValueStr !== badEncoding) ? JSON.parse(localValueStr) : localValue
    }
  }
  return localValue
}

LocalStorage.prototype.set = function(key, value) {
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

LocalStorage.prototype.getSettings = function() {
  return (this.hasSettings()) ? this.get(this._SETTINGS_KEY) : undefined
}

LocalStorage.prototype.setSettings = function(jsObj) {
  if (this.hasLocalStorage()) {
    let jsonObj = (typeof jsObj === 'obj') ? JSON.stringify(jsObj) : jsObj
    this.set(this._SETTINGS_KEY, jsonObj)
  }
}

LocalStorage.prototype.getPriorities = function() {
  return (this.hasPriorities()) ? this.get(this._PRIORITIES_KEY) : undefined
}

LocalStorage.prototype.setPriorities = function(jsObj) {
  if (this.hasLocalStorage()) {
    let jsonObj = (typeof jsObj === 'obj') ? JSON.stringify(jsObj) : jsObj
    this.set(this._PRIORITIES_KEY, jsonObj)
  }
}

LocalStorage.prototype.getFAB = function() {
  return (this.hasFAB()) ? this.get(this._FAB_KEY) : undefined
}

LocalStorage.prototype.setFAB = function(jsObj) {
  if (this.hasLocalStorage()) {
    let jsonObj = (typeof jsObj === 'obj') ? JSON.stringify(jsObj) : jsObj
    this.set(this._FAB_KEY, jsonObj)
  }
}

LocalStorage.prototype.getResults = function() {
  return (this.hasResults()) ? this.get(this._RESULTS_KEY) : undefined
}

LocalStorage.prototype.setResults = function(jsObj) {
  if (this.hasLocalStorage()) {
    let jsonObj = (typeof jsObj === 'obj') ? JSON.stringify(jsObj) : jsObj
    this.set(this._RESULTS_KEY, jsonObj)
  }
}

LocalStorage.prototype.clearSettings = function() {
  return this.clear(this._SETTINGS_KEY)
}

LocalStorage.prototype.clearPriorities = function() {
  return this.clear(this._PRIORITIES_KEY)
}

LocalStorage.prototype.clearFAB = function() {
  return this.clear(this._FAB_KEY)
}

LocalStorage.prototype.clearResults = function() {
  return this.clear(this._RESULTS_KEY)
}

LocalStorage.prototype.clear = function(localKey) {
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
    console.log('LocalStorage.clear(' + arg + ') failed.')
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

function UnitTestLocalStorage() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "local-storage.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')
  console.log(' Instantiating local storage object ...')
  let cache = new LocalStorage();

  console.log(' Clearing any previously persisted app data ...')
  cache.clear()

  // Test #1
  try {
    cut = "LocalStorage.hasLocalStorage()"
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
    cut = "LocalStorage(ctor)"
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
    cut = "LocalStorage.hasAppData()"
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
    cut = "LocalStorage.isValidKey()"
    console.log(' Verifying key validation (positive case) ...')
    if (!cache.isValidKey(cache._SETTINGS_KEY) || 
        !cache.isValidKey(cache._PRIORITIES_KEY) ||
        !cache.isValidKey(cache._FAB_KEY)) {
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
    cut = "LocalStorage.isValidKey()"
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
    cut = "LocalStorage.set()"
    console.log(' Verifying ability to store a key/value pair ...')
    let key = 'settings'
    let value = {numCities: 178, maxResults: 10, countryCode: 'US', locale: 'en-US'}

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
    cut = "LocalStorage.get()"
    console.log(' Verifying ability to retrieve a persisted value with a key ...')
    let key = 'settings'
    let value = {numCities: 178, maxResults: 10, countryCode: 'US', locale: 'en-US'}
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
