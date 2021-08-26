//----------------------------------------------------------------------------------
// Controller (for Results page)
//
// These methods define the event listeners associated with the results view.
//
// The event handlers typically cause the results view to be updated.
// Examples of this include:
//
//    * returning to the priorities page when the fab (<>) is clicked
//    * changing how the results are formatted (e.g., photo-view vs. table-view)
//----------------------------------------------------------------------------------
// TODO: Add a results model to mutate.
//----------------------------------------------------------------------------------

Controller.prototype.getResultsPageEventListeners = function() {
  return this.addResultsPageEventListeners
}

// Scroll away header (especially on mobile) when we want to devote
// maximum screen real estate to content.

Controller.prototype.addScrollEventListener = function() {

  // NB: Must place this /after/ menu redering for floating menu button
  //     to work since the menu button element is fetched from the DOM
  //     so style can be updated.

  let mainEl = document.getElementById("main")
  let headerEl = document.getElementById("header-id")
  let menuEl = document.querySelector(".mdl-layout__drawer-button")
  let menuFloatingClass = "mdl-layout__drawer-button--floating"

  if (mainEl && headerEl) {
    let useCapture = true // Otherwise photo-view header will not disappear on scroll.
    let headerEl = document.querySelector('#primary-header')
    let hasHeader = (headerEl) ? true : false

    let headerHeight = (hasHeader) ? headerEl.getBoundingClientRect().height : undefined
    let headerStyle = (hasHeader) ? window.getComputedStyle(headerEl) : undefined
    let headerMaxHeight = (hasHeader) ? headerStyle.getPropertyValue('max-height') : undefined
    // Get nominal visibility of dropdown-selection nav items.
    let headerOverflow = (hasHeader) ? headerStyle.getPropertyValue('overflow') : 'visible'

    let subheaderEl = document.querySelector('#secondary-header')
    let hasSubheader = (subheaderEl) ? true : false

    let subheaderHeight = (hasSubheader) ? subheaderEl.getBoundingClientRect().height : undefined
    let subheaderStyle = (hasSubheader) ? window.getComputedStyle(subheaderEl) : undefined
    let subheaderMaxHeight = (hasSubheader) ? subheaderStyle.getPropertyValue('max-height') : undefined
    // Get nominal visibility of dropdown-selection nav items.
    let subheaderOverflow = (hasSubheader) ? subheaderStyle.getPropertyValue('overflow') : 'visible'

    let transitionOut = "max-height 0.1s ease-out, overflow 0s ease-out"
    let transitionIn = "max-height 0.1s ease-in, overflow 0s ease-in"

    function setVisibleStyle(headerEl, headerMaxHeight, headerOverflow,
                             subheaderEl, subheaderMaxHeight, subheaderOverflow, transition,
                             menuEl, menuFloatingClass) {
      if (headerEl) {
        headerEl.style.maxHeight = headerMaxHeight

        // We restore overflow visibility when the header reappears so nav dropdowns
        // (like the locale picker) work again without occlusion.
        headerEl.style.overflow = headerOverflow

        headerEl.style.transition = transition
      }

      if (subheaderEl) {
        subheaderEl.style.maxHeight = subheaderMaxHeight
        subheaderEl.style.overflow = subheaderOverflow
        subheaderEl.style.transition = transition
      }

      if (menuEl) {
        menuEl.classList.remove(menuFloatingClass)
      }
    }

    function setInvisibleStyle(headerEl, subheaderEl, transition, menuEl, menuFloatingClass) {
      if (headerEl) {
        headerEl.style.maxHeight = 0

        // We hide overflow temporarily while header is scroll-disabled otherwise the
        // nav buttons/icons will drift down into view :-/.
        headerEl.style.overflow = 'hidden'

        headerEl.style.transition = transition
      }

      if (subheaderEl) {
        subheaderEl.style.maxHeight = 0
        subheaderEl.style.overflow = 'hidden'
        subheaderEl.style.transition = transition
      }

      if (menuEl) {
        menuEl.classList.add(menuFloatingClass)
      }
    }

    function isInvisible(headerEl) {
      return headerEl.style.maxHeight.charAt(0) === "0" // "0px or 0em"
    }

    function isVisible(headerEl) {
      return !isInvisible(headerEl)
    }

    function headerWorthy(scrollableEl, headerHeight) {
      // Scrollable element is large enough to accomodate a header.
      return scrollableEl.scrollHeight - scrollableEl.clientHeight <= headerHeight
    }

    if (hasHeader && hasSubheader) {
      mainEl.addEventListener("resize", (e) => {
        if (isInvisible(headerEl) && headerWorthy(e.target, headerHeight)) {
          setVisibleStyle(headerEl, headerMaxHeight, headerOverflow,
                          subheaderEl, subheaderMaxHeight, subheaderOverflow, transitionIn,
                          menuEl, menuFloatingClass)
        }
      })

      // Would like to use delegated handler for scroll events but doesn't
      // work reliably between photo-view and chart-view.  Suspect something
      // subtle with capture versus bubble is at play ... so having to call
      // document.addEventListener directly.
      //
      // TODO: Get this working pls :-)
      //
      // this.delegatedHandlers.addEventListener(
      //    document,
      //    "scroll",
      //    "#main",
      //    (e) => { /* scroll handler goes here */ }, useCapture)

      mainEl.addEventListener("scroll", (e) => {

        // Detect which view is active for this scroll event.
        // TODO: Clean up view detection to something less convoluted.

        let targetView = e.target.getAttribute("data-view")
        let targetClass = e.target.getAttribute("class")
        targetView = (targetView) ? targetView  // for photo and table view
                                  : (targetClass.startsWith("chartjs")) ? "chart"
                                  : (targetClass.startsWith("leaflet")) ? "map" : undefined

        switch (targetView) {
          case "photo": // Whitelist these views to use our custom scroll handler.
          case "table": //
              break     // Proceed to custom scroll handling

          case "chart": // Blacklist these views from using our custom scroll handler.
          case "map":   // These views are not playing nicely on mobile, especially map-view
                        // on Android.  Need better device emulation in dev env. :-)
          default:
              return    // Bail out, no custom scroll handling.
        }


        let preventJitter = headerHeight + subheaderHeight  // Hysteresis threshold, otherwise scroll
                                                            // bounces around for windows that only need a
                                                            // smidge of vertical scrolling.

        if (e.target.scrollTop === 0 && isInvisible(headerEl)) {
          setVisibleStyle(headerEl, headerMaxHeight, headerOverflow,
                          subheaderEl, subheaderMaxHeight, subheaderOverflow, transitionIn,
                          menuEl, menuFloatingClass)
        } else if (e.target.scrollTop  - preventJitter > 0  && isVisible(headerEl)) {
          setInvisibleStyle(headerEl, subheaderEl, transitionOut, menuEl, menuFloatingClass)
        }
      }, useCapture)
    }
  }
}

Controller.prototype.addResultsPageEventListeners = function() {

  // Render hamburger menu and make responsive to clicks.

  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()

  // Make header and subheader disappear on scroll down events.
  //
  // NB: Must go AFTER rendering menu since it fetches menu button
  //     from DOM so it can mutate it from fixed to floating visualization
  //     during scroll down scenario.

  this.addScrollEventListener()

  let fabEl = this.view.getFAB()
  if (fabEl) {
    this.delegatedHandlers.addEventListener(
          document,
          "click",
          "#floating-access-button",
          this.getFabEventListener(this.view.createPageBody.bind(this.view))
    )
  }


  let useCapture = true // Otherwise precedence is given to the low-level tab component
                        // event handler and focus may shift to a disabled view-button.
                        //
                        // We want the latitude to pre-empt the flow of events to 3rd-party
                        // components that don't understand our high-level visualization
                        // policy.
  this.delegatedHandlers.addEventListener(
      document,
      "click",
      ".view-link",
      this.getViewButtonEventListener(),
      useCapture)

}

Controller.prototype.getViewButtonEventListener = function() {
  let that = this
  function innerFunction(e) {
    let requestedView = this.getAttribute("id")
    let currentView = that.results.getActiveDataView()

    if (requestedView !== currentView && !requestedView.endsWith("disabled")) {
      // Update model based upon view-button just clicked.
      that.results.setActiveDataView(requestedView)

      // Update view according to model.
      that.view.setActiveDataView(that.results.getActiveDataView())
      that.cache.setResults(that.results.get())

      that.view.createPageBody("results")
    } else {

      // A visually-disabled view-button was clicked so we don't change model
      // state or the view itself.  Furthermore, we stop event propagation so
      // tab focus is not drawn to the disabled button by a lower-level handler
      // listening for the same event.
      //
      // BTW, we allow disabled buttons to be clicked because it brings up a
      // helpful tooltip explaing why the button is disabled.

      e.stopPropagation() // Otherwise event will propagate down to tab component and
                          // draw focus to disabled view-button.
      e.preventDefault()  // Otherwise index.html#map-button shows up as location in browser.
    }
  }
  return innerFunction
}
