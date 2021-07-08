//----------------------------------------------------------------------------------
// ModelResults
//
// This class maintains state related to the results page.
//
// It exports getters for use by the view and setters for use by the controller.
//----------------------------------------------------------------------------------
// TODO: Make this observable (in the software patterns sense).
//----------------------------------------------------------------------------------

function ModelResults(isValidCityListFn, dataView, rankedList, locale) {

  // Validate required input parameters.

  if (!isValidCityListFn || typeof isValidCityListFn !== 'function') {
    throw('ModelResults: Failed constructor.  Invalid isValidCityList fn parameter')
  }

  this.isValidCityListFn = isValidCityListFn

  this.dfltDataView = "photo-view" // photo-view | list-view | chart-view | map-view
  this.activeDataView = (this.isValidDataView(dataView)) ? dataView : this.dfltDataView

  this.dfltRankedList = []

  // TODO: Integrate with controller and view.
  this.rankedList = (rankedList) ? rankedList : this.dfltRankedList
  this.rankedList = (this.isValidCityListFn(this.rankedList)) ? this.rankedList : this.dfltRankedList

  //------------------------------------
  // Presentational strings
  //------------------------------------
  this.dfltLocale = "en-US"
  this.locale = (this.isValidLocale(locale)) ? locale : this.dfltLocale

  this.msgCatalog = {
    "all": {
      noResultsImg: "assets/img/chess-failure.jpg",
      monetizeImg: "assets/img/monetize.jpg"
    },
    "en-US": {
      title: "Your best bets ...",
      noResults: "No results available.",
      noResultsAdvice: "Please go back and specify one or more priorities.",
      monetizeHere: "Monetize here $",
      monetizeLearnMore: "Learn More",
      photoLabelHappiness: "Civic Happiness",
      photoLabelAffordability: "Median Home Price",
      photoLabelPolitics: "",
      chartTitle: "Alignment with your priorities (0 = ideal)",
      chartLabelCombined: "Combined",
      chartLabelHappiness: "Happiness",
      chartLabelAffordability: "Cost of Living",
      chartLabelPolitics: "Politics",
      listLabelHappiness: "Civic Happiness",      
      listLabelAffordability: "Median Home Price",      
      listLabelPolitics: ""
    },
    "hi-IN": {
      title: "आपके सबसे अच्छे शहर ...",
      noResults: "कोई परिणाम उपलब्ध नहीं है।",
      noResultsAdvice: "कृपया वापस जाएं और एक या अधिक प्राथमिकताएं निर्दिष्ट करें।",
      monetizeHere: "यहाँ विज्ञापन दें। ₹",
      monetizeLearnMore: "और अधिक जानें",
      photoLabelHappiness: "नागरिक खुशी",
      photoLabelAffordability: "मेडियन होम प्राइस",
      photoLabelPolitics: "",
      chartTitle: "अपनी प्राथमिकताओं के साथ संरेखण। (0 = आदर्श)",
      chartLabelCombined: "कम्पोजिट",
      chartLabelHappiness: "ख़ुशी",
      chartLabelAffordability: "जीवन यापन की लागत",
      chartLabelPolitics: "राजनीति",
      listLabelHappiness: "नागरिक खुशी",   
      listLabelAffordability: "मेडियन होम प्राइस",  
      listLabelPolitics: ""
    }
  }
}

// TODO: Change to enumerated types when javascript or I get smarter.
//       Really, I just want static const enumerated type associated
//       with a class, but that still seems to require hoop-jumping in js.
//       Maybe TypeScript is the answer.
//
//       Settling for strings with guard-rails as expedient proxy for now.

ModelResults.prototype.isValidDataView = function(dataView) {
  return dataView === "photo-view" ||
         dataView === "list-view"  ||
         dataView === "chart-view" ||
         dataView === "map-view"
}

ModelResults.prototype.getActiveDataView = function() {
  return this.activeDataView
}

ModelResults.prototype.setActiveDataView = function(dataView) {
  let result = false
  if (this.isValidDataView(dataView)) {
    this.activeDataView = dataView
    result = true
  } else {
    console.log('[Info] ModelResults.setActiveDataView.  Ignoring invalid dataView:', dataView)
  }
  return result
}

ModelResults.prototype.setLocale = function(locale) {
  let result = false
  if (this.isValidLocale(locale)) {
    this.locale = locale
    result = true
  } else {
    console.log('Error ModelResults.setLocale.  Invalid locale:', locale)
  }
  return result
}

ModelResults.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" || locale === "hi-IN")
}

ModelResults.prototype.getLocale = function() {
  if (this.isValidLocale(this.locale)) {
    return this.locale
  } else {
    console.log("ModelResults.getLocale() Info: returning default locale. Not", this.locale)
    return this.dfltLocale
  }
}

ModelResults.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelResults.prototype.getRankedList = function() {
  return this.rankedList
}

ModelResults.prototype.setRankedList = function(list) {
  let result = false
  if (this.isValidCityListFn(list)) {
    this.rankedList = list
    result = true
  } else {
    console.log('[Info] ModelResults.setRankedList.  Ignoring invalid list:', JSON.stringify(list, null, 2))
  }
  return result
}

ModelResults.prototype.getResultsTitle = function() {
  let result = "missing_title"
  if (this.isValidLocaleProperty(this.locale, 'title')) {
    result = this.msgCatalog[this.locale].title
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'title')) {
    result = this.msgCatalog[this.dfltLocale].title
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getTitle() Error ", result)
  }
  return result
}

ModelResults.prototype.getNoResults = function() {
  let result = "missing_noResults"
  if (this.isValidLocaleProperty(this.locale, 'noResults')) {
    result = this.msgCatalog[this.locale].noResults
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'noResults')) {
    result = this.msgCatalog[this.dfltLocale].noResults
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getNoResults() Error ", result)
  }
  return result
}

ModelResults.prototype.getNoResultsImg = function() {
  let result = "missing_noResultsImg"
  if (this.isValidLocaleProperty('all', 'noResultsImg')) {
    result = this.msgCatalog['all'].noResultsImg
  } else if (this.isValidLocaleProperty('all', 'noResultsImg')) {
    result = this.msgCatalog['all'].noResultsImg
  } else {
    result = (this.locale) ? result + "_" + 'all' : result
    console.log("ModelPriorities:getNoResultsImg() Error ", result)
  }
  return result
}

ModelResults.prototype.getNoResultsAdvice = function() {
  let result = "missing_noResultsAdvice"
  if (this.isValidLocaleProperty(this.locale, 'noResultsAdvice')) {
    result = this.msgCatalog[this.locale].noResultsAdvice
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'noResultsAdvice')) {
    result = this.msgCatalog[this.dfltLocale].noResultsAdvice
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getNoResultsAdvice() Error ", result)
  }
  return result
}
  
ModelResults.prototype.getMonetizeHere = function() {
  let result = "missing_monetizeHere"
  if (this.isValidLocaleProperty(this.locale, 'monetizeHere')) {
    result = this.msgCatalog[this.locale].monetizeHere
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'monetizeHere')) {
    result = this.msgCatalog[this.dfltLocale].monetizeHere
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getMonetizeHere() Error ", result)
  }
  return result
}

ModelResults.prototype.getMonetizeLearnMore = function() {
  let result = "missing_monetizeLearnMore"
  if (this.isValidLocaleProperty(this.locale, 'monetizeLearnMore')) {
    result = this.msgCatalog[this.locale].monetizeLearnMore
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'monetizeLearnMore')) {
    result = this.msgCatalog[this.dfltLocale].monetizeLearnMore
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getMonetizeLearnMore() Error ", result)
  }
  return result
}

ModelResults.prototype.getMonetizeImg = function() {
  let result = "missing_monetizeImg"
  if (this.isValidLocaleProperty('all', 'monetizeImg')) {
    result = this.msgCatalog['all'].monetizeImg
  } else if (this.isValidLocaleProperty('all', 'monetizeImg')) {
    result = this.msgCatalog['all'].monetizeImg
  } else {
    result = (this.locale) ? result + "_" + 'all' : result
    console.log("ModelPriorities:getMonetizeImg() Error ", result)
  }
  return result
}

ModelResults.prototype.getPhotoLabelHappiness = function() {
  let result = "missing_photoLabelHappiness"
  if (this.isValidLocaleProperty(this.locale, 'photoLabelHappiness')) {
    result = this.msgCatalog[this.locale].photoLabelHappiness
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'photoLabelHappiness')) {
    result = this.msgCatalog[this.dfltLocale].photoLabelHappiness
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getPhotoLabelHappiness() Error ", result)
  }
  return result
}

ModelResults.prototype.getPhotoLabelAffordability = function() {
  let result = "missing_photoLabelAffordability"
  if (this.isValidLocaleProperty(this.locale, 'photoLabelAffordability')) {
    result = this.msgCatalog[this.locale].photoLabelAffordability
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'photoLabelAffordability')) {
    result = this.msgCatalog[this.dfltLocale].photoLabelAffordability
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getPhotoLabelAffordability() Error ", result)
  }
  return result
}

ModelResults.prototype.getPhotoLabelPolitics = function() {
  let result = "missing_photoLabelPolitics"
  if (this.isValidLocaleProperty(this.locale, 'photoLabelPolitics')) {
    result = this.msgCatalog[this.locale].photoLabelPolitics
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'photoLabelPolitics')) {
    result = this.msgCatalog[this.dfltLocale].photoLabelPolitics
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getPhotoLabelPolitics() Error ", result)
  }
  return result
}

ModelResults.prototype.getChartTitle = function() {
  let result = "missing_chartTitle"
  if (this.isValidLocaleProperty(this.locale, 'chartTitle')) {
    result = this.msgCatalog[this.locale].chartTitle
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'chartTitle')) {
    result = this.msgCatalog[this.dfltLocale].chartTitle
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getChartTitle() Error ", result)
  }
  return result
}

ModelResults.prototype.getChartLabelCombined = function() {
  let result = "missing_chartLabelCombined"
  if (this.isValidLocaleProperty(this.locale, 'chartLabelCombined')) {
    result = this.msgCatalog[this.locale].chartLabelCombined
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'chartLabelCombined')) {
    result = this.msgCatalog[this.dfltLocale].chartLabelCombined
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getChartLabelCombined() Error ", result)
  }
  return result
}

ModelResults.prototype.getChartLabelHappiness = function() {
  let result = "missing_chartLabelHappiness"
  if (this.isValidLocaleProperty(this.locale, 'chartLabelHappiness')) {
    result = this.msgCatalog[this.locale].chartLabelHappiness
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'chartLabelHappiness')) {
    result = this.msgCatalog[this.dfltLocale].chartLabelHappiness
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getChartLabelHappiness() Error ", result)
  }
  return result
}

ModelResults.prototype.getChartLabelAffordability = function() {
  let result = "missing_chartLabelAffordability"
  if (this.isValidLocaleProperty(this.locale, 'chartLabelAffordability')) {
    result = this.msgCatalog[this.locale].chartLabelAffordability
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'chartLabelAffordability')) {
    result = this.msgCatalog[this.dfltLocale].chartLabelAffordability
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getChartLabelAffordability() Error ", result)
  }
  return result
}

ModelResults.prototype.getChartLabelPolitics = function() {
  let result = "missing_chartLabelPolitics"
  if (this.isValidLocaleProperty(this.locale, 'chartLabelPolitics')) {
    result = this.msgCatalog[this.locale].chartLabelPolitics
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'chartLabelPolitics')) {
    result = this.msgCatalog[this.dfltLocale].chartLabelPolitics
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getChartLabelPolitics() Error ", result)
  }
  return result
}

ModelResults.prototype.getListLabelHappiness = function() {
  let result = "missing_listLabelHappiness"
  if (this.isValidLocaleProperty(this.locale, 'listLabelHappiness')) {
    result = this.msgCatalog[this.locale].listLabelHappiness
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'listLabelHappiness')) {
    result = this.msgCatalog[this.dfltLocale].listLabelHappiness
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getListLabelHappiness() Error ", result)
  }
  return result
}

ModelResults.prototype.getListLabelAffordability = function() {
  let result = "missing_listLabelAffordability"
  if (this.isValidLocaleProperty(this.locale, 'listLabelAffordability')) {
    result = this.msgCatalog[this.locale].listLabelAffordability
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'listLabelAffordability')) {
    result = this.msgCatalog[this.dfltLocale].listLabelAffordability
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getListLabelAffordability() Error ", result)
  }
  return result
}

ModelResults.prototype.getListLabelPolitics = function() {
  let result = "missing_listLabelPolitics"
  if (this.isValidLocaleProperty(this.locale, 'listLabelPolitics')) {
    result = this.msgCatalog[this.locale].listLabelPolitics
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'listLabelPolitics')) {
    result = this.msgCatalog[this.dfltLocale].listLabelPolitics
  } else {
    result = (this.locale) ? result + "_" + this.locale : result
    console.log("ModelPriorities:getListLabelPolitics() Error ", result)
  }
  return result
}

//----------------------------------------------------------------------------------
// Unit Test
//----------------------------------------------------------------------------------
function UnitTestSchema(obj, expectedProperties) {
  // Is it time for Typescript or 3rd party test harness? :-)
  let failedProperties = expectedProperties.map((propertyExpr) => {
    let failure = ""

    // Does property exist in object?

    let property = propertyExpr.split(":")[0]
    failure = (!obj.hasOwnProperty(property)) ? `Missing property: ${property}\n` : ''

    // Is it of the expected type?

    let parsed = undefined
    let typeFailure = ""
    let type = propertyExpr.split(":")[1]
    let value = obj[property]
    if (!failure && type) {
      switch(type) {
        case 'integer':
          // NB: This will identify 'string' integers as integers.
          parsed = parseInt(value)
          if (isNaN(parsed)) {
            typeFailure = `Expecting type: ${property}:${type}\n`
          }
          break
        case 'float':
          // NB: This will identify 'string' floats as floats.
          parsed = parseFloat(value)
          if (isNaN(parsed)) {
            typeFailure = `Expecting type: ${property}:${type}\n`
          }
          break
        case 'object':
          if (!value || typeof value !== 'object' || value.constructor !== Object) {
            typeFailure = `Expecting type: ${property}:${type}\n`
          }
          break
        case 'array':
          if (!Array.isArray(value)) {
            typeFailure = `Expecting type: ${property}:${type}\n`
          }
          break
        case 'string':
          if (typeof value !== 'string') {
            typeFailure = `Expecting type: ${property}:${type}\n`
          }
          break

        default:
          typeFailure = `Unknown type: ${property}:${type}\n`
      }
      failure = typeFailure
    }
    return failure
  }).filter((failureStr) => { return failureStr })

  let reducerReportFailures = (accumulator, currentValue, currentIndex) => {
    if (!accumulator) {
      accumulator = " Failure with these properties: \n"
    }
    accumulator += `  ${currentIndex + 1}. ${currentValue} \n`
    return accumulator
  }

  failures = failedProperties.reduce(reducerReportFailures, "")
  return failures
}

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

function UnitTestModelResults() {
  let cut = ""
  let failure = ""
  let errmsg = undefined
  let module = "model-results.js"
  let cityModel = new ModelCities() // For isValidCityList() validator.

  console.log('Starting unit tests for ' + module)
  console.log('----------------------------------------')

  console.log(' Instantiating model results object ...')

  // Test #1
  try {
    cut = "ModelResults(ctor)"
    console.log(' Verifying default object construction ...')
    let model = new ModelResults(cityModel.isValidCityList)

    if (model.activeDataView !== model.dfltDataView ||
        JSON.stringify(model.rankedList) !== JSON.stringify([]) || 
        model.locale !== 'en-US') {
        failure = "Expected properties of [photo-view, [], 'en-US'].  Got " +
                  JSON.stringify([model.activeDataView, model.rankedList, model.locale])
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
    cut = "ModelResults(ctor) negative case"
    console.log(' Verifying object construction with invalid data-view ...')
    let model = new ModelResults(cityModel.isValidCityList, "bogus-view")

    if (model.activeDataView !== model.dfltDataView ||
        JSON.stringify(model.rankedList) !== JSON.stringify([]) || 
        model.locale !== 'en-US') {
        failure = "Expected properties of [photo-view, [], 'en-US'].  Got " +
                  JSON.stringify([model.activeDataView, model.rankedList, model.locale])
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
    cut = "ModelResults(ctor)"
    console.log(' Verifying object construction with valid non-default data-view ...')
    let model = new ModelResults(cityModel.isValidCityList, "list-view")

    if (model.activeDataView !== "list-view" ||
        JSON.stringify(model.rankedList) !== JSON.stringify([]) || 
        model.locale !== 'en-US') {
        failure = "Expected properties of ['list-view', [], 'en-US'].  Got " +
                  JSON.stringify([model.activeDataView, model.rankedList, model.locale])
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
    cut = "ModelResults.getRankedList()"
    console.log(' Verifying ability to get ranked list ...')
    let model = new ModelResults(cityModel.isValidCityList)
    let rankedList = model.getRankedList()

    if (JSON.stringify(rankedList) !== JSON.stringify([])) {
        failure = "Expected rankedList of [].  Got " + JSON.stringify(rankedList)
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
    cut = "ModelResults.setRankedList()"
    console.log(' Verifying ability to set ranked list ...')
    let model = new ModelResults(cityModel.isValidCityList)
    let dummyList = [
    {
      "Plano, TX": {
        affordability: 265300,
        happiness: 72.3,
        img: {
          imgAuthor: "Eric Fredericks",
          imgLic: "(CC BY-SA 2.0)",
          imgSrc:
            "https://upload.wikimedia.org/wikipedia/commons/2/29/Legacy_town_center_plano.jpg"
        },
        location: {
          lat: 33.0198431,
          lng: -96.6988856
        },
        politics: {
          dem16_frac: 39.22001430394481,
          rep16_frac: 56.20468664544448
        }
      }
    },
    {
      "Irvine, CA": {
        affordability: 620500,
        happiness: 71.86,
        img: {
          imgAuthor: "Poppashoppa22",
          imgLic: "(CC BY-SA 3.0)",
          imgSrc:
            "https://upload.wikimedia.org/wikipedia/commons/a/a8/Campus_of_the_University_of_California%2C_Irvine_%28aerial_view%2C_circa_2006%29.jpg"
        },
        location: {
          lat: 33.6845673,
          lng: -117.8265049
        },
        politics: {
          dem16_frac: 50.96015441583128,
          rep16_frac: 43.28010943892407
        }
      }
    }]

    model.setRankedList(dummyList)
    let rankedList = model.getRankedList()

    if (JSON.stringify(rankedList) !== JSON.stringify(dummyList)) {
        failure = "Expected rankedList of " + JSON.stringify(dummyList) + 
                  " Got " + JSON.stringify(rankedList)
    }

    if (failure) {
      throw(mkFailMsg(cut, failure))
    } else {
      console.log(mkPassMsg(cut))
    }
  } catch(e) {
    console.error(e)
  }

} // End UnitTest
