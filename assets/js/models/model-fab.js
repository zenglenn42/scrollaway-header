//----------------------------------------------------------------------------------
// ModelFAB (Foating Action Button)
//
// This class maintains state related to the application's floating action
// button:
//
//    pageState  = catenation of previous and currently displayed app pages.
//                 We need previous page so we can navigate /back/ in some case
//
//    visibility = controls visibility of the FAB (visible when true)
//
// Derived-state (from pageState)
//
//    fabIcon    = ascii representation of icon associated with FAB for a given page
//
//    fabPage    = app page to advance to if the FAB is clicked
//
//    fabTooltip = hover text associated with the FAB
//
//----------------------------------------------------------------------------------
// TODO: Make this observable (in the software patterns sense).
// TODO: Decide if ctor should throw exception on invalid input versus resilient
//       fallback to default values.
//----------------------------------------------------------------------------------

function ModelFAB(
        getLocale = () => {return "en-US"}, 
        pageState = "dontcare_landing", 
        visibility = true) {

  if (!getLocale || typeof getLocale !== 'function') {
    throw('ModelFAB: Failed constructor.  Invalid getLocale fn parameter')
  }
  this.getLocale = getLocale
  this.dfltLocale = "en-US"

  // Localize the FAB tooltip text.
  //
  // The locale codes are based upon a two-letter language tag (see IETF BCP-47)
  // and a two-letter region code (see ISO 3166).

  this.msgCatalog = {
    "en-US": {
      gotoNextStep: "Next step",
      gotoPrevStep: "Previous step"
    },
    "hi-IN": {
      gotoNextStep: "अगला कदम",
      gotoPrevStep: "पिछला कदम"
    },
    "es-ES": {
      gotoNextStep: "Próximo paso",
      gotoPrevStep: "Paso anterior"
    },
    "zh-CN": {
      gotoNextStep: "下一步",
      gotoPrevStep: "前一步"
    }
  }

  this.delim = '_'
  this.dfltPageState = `dontcare${this.delim}landing`

  this.fabPage = undefined
  this.fabIcon = undefined
  this.fabTooltip = ""
  this.setPageAndFabState(pageState)

  this.dfltVisibility = true
  this.visibility = (typeof visiblity === 'boolean') ? visibility : this.dfltVisibility
}

ModelFAB.prototype.getVisibility = function() {
  // TODO: Add validation?
  return this.visibility
}

ModelFAB.prototype.getPageState = function() {
  // TODO: Add validation?
  return this.pageState
}

ModelFAB.prototype.getPrevPage = function() {
  // TODO: Add validation?
  return this.pageState.split(this.delim)[0]
}

ModelFAB.prototype.getCurrPage = function() {
  // TODO: Add validation?
  return this.pageState.split(this.delim)[1]
}

// TODO: Consider adding setCurrPage which would be a kinder
//       gentler way to set FAB state.  Especially for
//       controller-menu.js and 'View' button event handlers.

ModelFAB.prototype.setPageAndFabState = function(state) {
    // TODO: Throw exception here?  Or okay with graceful degradation to default?
    this.pageState = this.isValidPageState(state) ? state : this.dfltPageState

    let props = {}
    props = this.getProps(this.pageState)
    this.fabPage = props.fabPage
    this.fabIcon = props.fabIcon
    this.fabTooltip = props.fabTooltip
}

ModelFAB.prototype.setVisibility = function(visibility) {
  this.visibility = (typeof visibility === 'boolean') ? visibility : this.visibility
}

// The use-case for this method is initialization from persisted state
// or from within the FAB constructor.

ModelFAB.prototype.set = function(jsonObj) {
  if (jsonObj) {
    // TODO: Add schema version to validate what props and prop naming we /expect/.

    let props = (typeof jsonObj === 'object') ? jsonObj : JSON.parse(jsonObj)
    this.setVisibility(props.visibility)
    this.setPageAndFabState(props.pageState)
  } else {
    console.log("[Info] ModelFAB.set(json): Ignoring set, json parameter is undefined.")
  }
}

ModelFAB.prototype.get = function() {
  let obj = {}

  obj = {
    pageState: this.pageState,
    visibility: this.visibility,
  }
  return obj
}

ModelFAB.prototype.isValidPageState = function(state) {
  let result = false
  let delim = this.delim
  switch(state) {
    case `dontcare${delim}landing`:
    case `landing${delim}priorities`:
    case `priorities${delim}results`:
    case `landing${delim}settings`:
    case `landing${delim}overview`:
    case `priorities${delim}settings`:
    case `priorities${delim}overview`:
    case `results${delim}settings`:
    case `results${delim}overview`:
        result = true
        break
    default:
        result = false
  }
  return result
}

ModelFAB.prototype.isValidPage = function(page) {
  let result = false

  switch(page) {
    case "landing":
    case "priorities":
    case "results":
    case "settings":
    case "overview":
      result = true
  }
  return result
}

ModelFAB.prototype.isValidLocale = function(locale) {
  return (locale === "en-US" ||
          locale === "hi-IN" ||
          locale === "es-ES" ||
          locale === "zh-CN")
}

ModelFAB.prototype.isValidLocaleProperty = function(locale, prop) {
  return (this.msgCatalog.hasOwnProperty(locale)) &&
         (this.msgCatalog[locale].hasOwnProperty(prop))
}

ModelFAB.prototype.getGotoNextStep = function() {
  let result = "missing_gotoNextStep"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'gotoNextStep')) {
    result = this.msgCatalog[locale].gotoNextStep
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'gotoNextStep')) {
    result = this.msgCatalog[this.dfltLocale].gotoNextStep
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelFAB:getGotoNextStep() Error ", result)
  }
  return result
}

ModelFAB.prototype.getGotoPrevStep = function() {
  let result = "missing_gotoPrevStep"
  let locale = this.getLocale()
  if (this.isValidLocaleProperty(locale, 'gotoPrevStep')) {
    result = this.msgCatalog[locale].gotoPrevStep
  } else if (this.isValidLocaleProperty(this.dfltLocale, 'gotoPrevStep')) {
    result = this.msgCatalog[this.dfltLocale].gotoPrevStep
  } else {
    result = (locale) ? result + "_" + locale : result
    console.log("ModelFAB:getGotoPrevStep() Error ", result)
  }
  return result
}

// Given the current state, return the page and icon
// info for the floating action button (fab).  The page reflects
// what page should be displayed when the fab is clicked.

ModelFAB.prototype.getProps = function(pageState = this.pageState) {
  let props = {
    fabPage:    undefined,
    fabIcon:    undefined,
    fabTooltip: undefined
  }
  const delim = this.delim

  // ---------------------------
  // current || fab        | fab
  // state   || page       | icon
  // --------++-----------------
  // xl      || priorities |  >
  // lp      || results    |  > 
  // pr      || priorities |  <
  // ls      || landing    |  <
  // lo      || landing    |  <
  // ps      || priorities |  <
  // po      || priorities |  <
  // rs      || results    |  <
  // ro      || results    |  <
  // ---------------------------

  switch(pageState) {
    case `dontcare${delim}landing`: {
      props.fabPage = "priorities"
      props.fabIcon = ">"
      props.fabTooltip = this.getGotoNextStep()
    }
    break

    case `landing${delim}priorities`: {
      props.fabPage = "results"
      props.fabIcon = ">"
      props.fabTooltip = this.getGotoNextStep()
    }
    break

    case `priorities${delim}results`: {
      props.fabPage = "priorities"
      props.fabIcon = "<"
      props.fabTooltip = this.getGotoPrevStep()
    }
    break

    case `landing${delim}settings`: 
    case `landing${delim}overview`: {
      props.fabPage = "landing"
      props.fabIcon = "<"
      props.fabTooltip = this.getGotoPrevStep()
    }
    break

    case `priorities${delim}settings`: 
    case `priorities${delim}overview`: {
      props.fabPage = "priorities"
      props.fabIcon = "<"
      props.fabTooltip = this.getGotoPrevStep()
    }
    break

    case `results${delim}settings`: 
    case `results${delim}overview`: {
      props.fabPage = "results"
      props.fabIcon = "<"
      props.fabTooltip = this.getGotoPrevStep()
    }
    break

    default: {
      console.log("Model.FAB.getPageAndIcon(): Unrecognized current state:", pageState)
    }
  }
  return props
}

//------------------------------------------------------------------------------
// This method implements a state machine which controls the behavior
// of the floating action button (FAB) as the user navigates to various
// pages of the application.
//
// State transition events happen when:
//
// 1. The FAB button is clicked.
// 2. The edit-settings page is selected (through a menu click).
// 3. The overview-help page is selected (through a menu click).
// 4. The FAB model object is constructed or state set from persisted values.
//
// In general, state transitions from:
//
//    landing page --to--> priorities page --to--> results page --+
//                                ^                               |
//                                |                               |
//                                +-------------to----------------+
//
// however, the user may detour to the settings or overview page and back
// again at any time.
//
// This method is suited for invocation from within controller event
// handlers associated with menu and FAB components.
//
// TODO: This needs to be rethought if/when the model becomes observable.
//------------------------------------------------------------------------------

ModelFAB.prototype.setNextPageState = function(event) {

  // Validate input event.

  if (event !== "fab"      && 
      event !== "settings" && 
      event !== "overview") {

    console.log("ModelFAB.setNextPageState() [Info]: Unrecognized event =", 
                 event, " Ignoring.  State unchanged.")
    return
  }

  const delim = this.delim
  let nextPageState = undefined

  switch(this.pageState) {
    case `dontcare${delim}landing`: {

      //-------------------------
      // Landing Page    
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // xl      | f     || lp
      // xl      | s     || ls
      // xl      | o     || lo
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `landing${delim}priorities`
        }
        break

        case "settings": {
          nextPageState = `landing${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `landing${delim}overview`
        }
        break
      }
    }
    break

    case `landing${delim}priorities`: {

      //-------------------------
      // Priorities Page    
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // lp      | f     || pr
      // lp      | s     || ps
      // lp      | o     || po
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `priorities${delim}results`
        }
        break

        case "settings": {
          nextPageState = `priorities${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `priorities${delim}overview`
        }
        break
      }
    }
    break

    case `priorities${delim}results`: {

      //-------------------------
      // Results Page    
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // pr      | f     || lp
      // pr      | s     || rs
      // pr      | o     || ro
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `landing${delim}priorities`
        }
        break

        case "settings": {
          nextPageState = `results${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `results${delim}overview`
        }
        break
      }
    }
    break

    case `landing${delim}settings`: 
    case `landing${delim}overview`: {

      //-------------------------
      // Settings Page (from Landing)
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // ls      | f     || xl
      // ls      | s     || ls
      // ls      | o     || lo
      //-------------------------

      // or

      //-------------------------
      // Overview Page (from Landing)
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // lo      | f     || xl
      // lo      | s     || ls
      // lo      | o     || lo
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `dontcare${delim}landing`
        }
        break

        case "settings": {
          nextPageState = `landing${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `landing${delim}overview`
        }
        break
      }
    }
    break

    case `priorities${delim}settings`: 
    case `priorities${delim}overview`: {

      //-------------------------
      // Settings or Overview Page (from Priorities)
      //
      // current | event || next
      // state   |       || state
      // --------+-------++------
      // ps,po   | f     || lp
      // ps,po   | s     || ps
      // ps,po   | o     || po
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `landing${delim}priorities`
        }
        break

        case "settings": {
          nextPageState = `priorities${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `priorities${delim}overview`
        }
        break
      }
    }
    break

    case `results${delim}settings`:
    case `results${delim}overview`: {

      //-------------------------
      // Settings or Overview Page (from Results)
      //
      // current | event || next
      // state   |       || state
      // ------------------------
      // rs,ro   | f     || pr
      // rs,ro   | s     || rs
      // rs,ro   | o     || ro
      //-------------------------

      switch(event) {
        case "fab": {
          nextPageState = `priorities${delim}results`
        }
        break

        case "settings": {
          nextPageState = `results${delim}settings`
        }
        break

        case "overview": {
          nextPageState = `results${delim}overview`
        }
        break
      }
    }
    break

    default: {
      nextPageState = `dontcare${delim}landing` // Nominal app start-up state.
      console.log("ModelFAB.setNextPageState() [Info]: Unknown view state: pageState =", pageState, ". ",
                  "Reverting to landing page view.")
    }
  }

  // Update page state.

  this.pageState = nextPageState ? nextPageState : this.pageState
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

function UnitTestModelFAB() {
  let cut = ""
  let failure = undefined
  let errmsg = undefined
  let module = "model-fab.js"

  console.log('Starting unit tests for ' + module)
  console.log('---------------------------------------')

  // Test #1
  try {
    let dfltFabModel = new ModelFAB()
    cut = "ModelFAB() dflt constructor"
    console.log(' Verifying default construction when ctor called without params ...')

    if (dfltFabModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + dfltFabModel.getLocale()
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
    let nrmlFabModel = new ModelFAB(() => {return "en-US"})
    cut = "ModelFAB('en-US') constructor"
    console.log(' Verifying nominal construction when ctor called with valid locale getter...')

    if (nrmlFabModel.getLocale() !== "en-US") {
      failure = "Expected locale of en-US, but got " + nrmlFabModel.getLocale()
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
  let fabModel = new ModelFAB()
  try {
    failure = ""
    cut = "ModelFAB.getGotoNextStep()"
    console.log(' Verifying expected next tooltip text is returned from getter ...')

    let tooltip = fabModel.getGotoNextStep()

    if (tooltip !== "Next step") {
      failure = "Expected tooltip of 'Next step', but got " + tooltip
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
    failure = ""
    cut = "ModelFAB.getGotoPrevStep()"
    console.log(' Verifying expected prev tooltip text is returned from getter ...')

    let tooltip = fabModel.getGotoPrevStep()

    if (tooltip !== "Previous step") {
      failure = "Expected tooltip of 'Previous step', but got " + tooltip
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
    falure = ""
    let nrmlFabModel = new ModelFAB(()=>{return "en-US"}, pageState = "bogus_landing")
    cut = "ModelFAB() ctor with bogus prevPage state"
    console.log(' Verifying ctor will normalize prevPage to something valid ...')

    let prevPage = nrmlFabModel.pageState.split(nrmlFabModel.delim)[0]

    if (prevPage !== "dontcare") {
      failure = "Expected prevPage normalized to 'dontcare', but got " + prevPage
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
    falure = ""
    let nrmlFabModel = new ModelFAB(()=>{return "en-US"})
    cut = "ModelFAB().isValidPage()"
    console.log(' Verifying we can detect valid page string ...')

    if (nrmlFabModel.isValidPage("overview") !== true) {
      failure = "Expected 'overview' to be valid but isValidPage() said it was not. :-("
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
    falure = ""
    let nrmlFabModel = new ModelFAB(()=>{return "en-US"})
    cut = "ModelFAB().isValidPage()"
    console.log(' Verifying we can detect invalid page string ...')

    if (nrmlFabModel.isValidPage("bogus_page") !== false) {
      failure = "Expected 'bogus_page' to be invalid but isValidPage() said it was. :-("
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
