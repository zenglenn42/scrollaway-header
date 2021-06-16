function SettingsModel(maxCities, maxResults = 10) {
  this.maxCities = maxCities
  this.maxDefaultResults = Math.min(maxCities, maxResults)

  this.maxResults = maxResults
}

// ----------------------------------------------------------
// TODO: Keep this setter updated as state schema changes!
// ----------------------------------------------------------
SettingsModel.prototype.restoreDefaults = function() {
  //this.clearLocalStorage()
  //let localState = JSON.parse(JSON.stringify(this.getDefaultLocalState()))
  //this.setLocalState(localState)
  //this.saveLocalState() // Persist to localStorage.
}

SettingsModel.prototype.maxResultsIsValid = function(maxResults) {
  // TODO: When city model data becomes dynamic, we should probably
  //       make this model subscribe to city model for changes in maxCities.
  return Number.isInteger(maxResults) && maxResults > 0 && maxResults <= this.maxCities
};

SettingsModel.prototype.getMaxResultsCB = function() {
  return this.getMaxResults
};

SettingsModel.prototype.getMaxResults = function() {
  if (this.maxResultsIsValid(this.maxResults)) {
    return this.maxResults
  } else {
    return this.maxDefaultResults
  }
};

SettingsModel.prototype.setMaxResults = function(maxResults) {
  let result = false;
  if (this.maxResultsIsValid(maxResults)) {
    this.maxResults = maxResults
    result = true
  } else {
    console.log('Error SettingsModel.setMaxResults.  maxResults out of range:', maxResults)
  }
  return result
};
