//----------------------------------------------------------------------------------
// ModelCities
//
// This class implements the core business logic for ranking a list of cities based
// upon user priorities (desired civic happiness, desired prevailing politics, 
// desired affordability).
//
// It also exports some getters that enable the controller to configure various
// input controls such as preference sliders.
//----------------------------------------------------------------------------------

function ModelCities() {
  this.modelStaticCities = new ModelStaticCities()

  // For now, drive the model with mediocre, statically-sourced city data.
  // This will evolve to a fullstack model with backend db.
  // I can't give all the IP away :D

  this.data = this.modelStaticCities.data

  // TODO: Make this a static class method since list validation may be useful to others
  //       outside the presence of an instantiated city model (e.g., ModelResults ctor)

  this.isValidCityList = this.modelStaticCities.isValidCityList.bind(this.modelStaticCities)
}

ModelCities.prototype.getMinHappinessValue = function() {
  return this.modelStaticCities.minHappinessValue
}

ModelCities.prototype.getMidHappinessValue = function() {
  return this.modelStaticCities.midHappinessValue
}

ModelCities.prototype.getMaxHappinessValue = function() {
  return this.modelStaticCities.maxHappinessValue
}

ModelCities.prototype.getMinAffordabilityValue = function() {
  return this.modelStaticCities.minAffordabilityValue
}

ModelCities.prototype.getMidAffordabilityValue = function() {
  return this.modelStaticCities.midAffordabilityValue
}

ModelCities.prototype.getMaxAffordabilityValue = function() {
  return this.modelStaticCities.maxAffordabilityValue
}

ModelCities.prototype.getMinPoliticsValue = function() {
  return 0
}

ModelCities.prototype.getMidPoliticsValue = function() {
  return this.modelStaticCities.midPoliticsValue
}

ModelCities.prototype.getMaxPoliticsValue = function() {
  return 100
}

ModelCities.prototype.getNumCities = function() {
  return this.modelStaticCities.data.length
}

ModelCities.prototype.getAffordabilityRange = function() {
  return {min: this.getMinAffordabilityValue(),
          max: this.getMaxAffordabilityValue()}
}

ModelCities.prototype.getHappinessRange = function() {
  return {min: this.getMinHappinessValue(),
          max: this.getMaxHappinessValue()}
}

ModelCities.prototype.getPoliticsRange = function() {
  return {min: this.getMinPoliticsValue(),
          max: this.getMaxPoliticsValue()}
}

ModelCities.prototype.distance = function(v, w) {
  let squaredDiffs = 0
  let distance = NaN
  if (v.length == w.length) {
    for (let i = 0; i < v.length; i++) {
      if (isNaN(v[i])) continue // Ignore disabled user priorities.
      squaredDiffs += Math.pow(v[i] - w[i], 2)
    }
    distance = Math.sqrt(squaredDiffs)
  } else {
    console.log("ModelCities.distance() error: input vectors are different lengths.")
  }
  return distance
}

ModelCities.prototype.isEmpty = function(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

ModelCities.prototype.getCityRankCB = function() {
  return this.cityRank
}

ModelCities.prototype.cityRank = function(userPriorities) {
  // userPriorities = {"happiness": value,
  //              "affordability": value,
  //              "politics": {"rep16_frac": val, "dem16_frac": val}}

  if (this.isEmpty(userPriorities)) {
    console.log("ModelCities.cityRank() Error: empty userPriorities")
    return []
  }
  let rankedCities = []
  rankedCities = this.data.slice()
  // console.log(rankedCities)

  let minHappiness = parseInt(this.modelStaticCities.minHappinessValue)
  let maxHappiness = parseInt(this.modelStaticCities.maxHappinessValue)
  let happinessRange = maxHappiness - minHappiness

  let minAffordability = parseInt(this.modelStaticCities.minAffordabilityValue)
  let maxAffordability = parseInt(this.modelStaticCities.maxAffordabilityValue)
  let affordabilityRange = maxAffordability - minAffordability

  let scaledHappiness = NaN
  let scaledAffordability = NaN
  let scaledPolitics = userPriorities.politics
  if (!isNaN(userPriorities.happiness)) {
    scaledHappiness =
      (userPriorities.happiness - minHappiness) * (100 / happinessRange)
  }
  if (!isNaN(userPriorities.affordability)) {
    scaledAffordability =
      (userPriorities.affordability - minAffordability) * (100 / affordabilityRange)
  }

  let v = [scaledHappiness, scaledAffordability, scaledPolitics.rep16_frac]
  // console.log("userPriorities v = ", v)

  for (let i = 0; i < rankedCities.length; i++) {
    let item = rankedCities[i]
    // IMPORTANT: Order of picked fields must match order of fields in v.
    let cityAttr = Object.values(
      this.cherryPickFields(["happiness", "affordability", "politics"], item)
    )
    // console.log(cityAttr)
    scaledHappiness =
      (parseFloat(cityAttr[0]) - minHappiness) * (100 / happinessRange)
    scaledAffordability =
      (parseFloat(cityAttr[1]) - minAffordability) * (100 / affordabilityRange)

    let w = [
      scaledHappiness,
      scaledAffordability,
      parseFloat(cityAttr[2].rep16_frac)
    ]
    // vector difference between user priorities (v) and city metrics (w)
    let vDistance = this.distance(v, w)

    // pass these individual deltas back to caller so they can be reported
    // in the chart-view
    let hDistance = v[0] - w[0]
    let aDistance = v[1] - w[1]
    let pDistance = v[2] - w[2]

    let distance = {
      vector: vDistance,
      happiness: hDistance,
      affordability: aDistance,
      politics: pDistance
    }

    let key = Object.keys(item)[0]
    rankedCities[i][key]["distance"] = distance
    // console.log(key, "distance = ", distance)
  }
  let compareFn = this.getCompareDistance()
  rankedCities.sort(compareFn)
  return rankedCities
}

ModelCities.prototype.cherryPickFields = function(arrayOfFields, item) {
  results = {}
  for (let fieldName of arrayOfFields) {
    let key = this.getCityST(item)
    results[fieldName] = item[key][fieldName]
  }
  return results
}

ModelCities.prototype.getCityST = function(item) {
  return Object.keys(item).join()
}

ModelCities.prototype.getCompareDistance = function() {
  function compareDistance(a, b) {
    let aKey = Object.keys(a)[0]
    let bKey = Object.keys(b)[0]
    let aDistance = a[aKey].distance.vector
    let bDistance = b[bKey].distance.vector
    if (aDistance > bDistance) return 1
    if (aDistance == bDistance) return 0
    if (aDistance < bDistance) return -1
  }
  return compareDistance
}
