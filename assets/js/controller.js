function Controller(bodyDivId) {
  this.cityModel = new CityModel();
  this.cache = new LocalPersistence();

  let numCities = this.cityModel.getNumCities()
  this.settings = new SettingsModel(numCities)

  this.priorities = new PrioritiesModel(
    this.cityModel.getMidAffordabilityValue(),
    this.cityModel.getMidHappinessValue(),
    this.cityModel.getMidPoliticsValue(),
    {min: this.cityModel.getMinAffordabilityValue(),
     max: this.cityModel.getMaxAffordabilityValue()},
    {min: this.cityModel.getMinHappinessValue(),
     max: this.cityModel.getMaxHappinessValue()},
    {min: this.cityModel.getMinPoliticsValue(),
     max: this.cityModel.getMaxPoliticsValue()}
  )

  this.view = new View(
    bodyDivId,
    this.getMenuDrawerEventListeners().bind(this),
    this.getLandingPageEventListeners().bind(this),
    this.getPreferencesPageEventListeners().bind(this),
    this.getResultsPageEventListeners().bind(this),
    this.getSettingsPageEventListeners().bind(this),
    this.cityModel.getCityRankCB().bind(this.cityModel),
    this.cityModel.getMinHappinessValue(),
    this.cityModel.getMaxHappinessValue(),
    this.cityModel.getMinAffordabilityValue(),
    this.cityModel.getMaxAffordabilityValue(),
    this.cityModel.getMinPoliticsValue(),
    this.cityModel.getMaxPoliticsValue(),
    this.cityModel.githubUrl,
    this.cache.hasSettings.bind(this.cache),
    this.settings.getMaxResults.bind(this.settings),
    this.settings.getMaxResultsOptions.bind(this.settings),
    this.settings.getLangCode.bind(this.settings),
    this.settings.getLangName.bind(this.settings),
    this.settings.getLangOptionsMap.bind(this.settings),
    this.settings.getCountryCode.bind(this.settings),
    this.settings.getCountryName.bind(this.settings),
    this.settings.getCountryOptionsMap.bind(this.settings),
    this.settings.getLocale.bind(this.settings),
    this.settings.getCurrency.bind(this.settings),
    this.priorities.getAffordabilityValue.bind(this.priorities),
    this.priorities.getHappinessValue.bind(this.priorities),
    this.priorities.getPoliticsValue.bind(this.priorities),
    this.priorities.getAffordabilityEnabled.bind(this.priorities),
    this.priorities.getHappinessEnabled.bind(this.priorities),
    this.priorities.getPoliticsEnabled.bind(this.priorities),
    this.priorities.getJobSearchEnabled.bind(this.priorities),
    this.priorities.getNormalizedPriorities.bind(this.priorities),
    this.priorities.hasNoPriorities.bind(this.priorities)
  );
  this.view.createLandingBody();
}

// https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on
Controller.prototype.delegate = function(el, evt, sel, handler) {
  el.addEventListener(evt, function(event) {
    let t = event.target;
    while (t && t !== this) {
      if (t.matches(sel)) {
        handler.call(t, event);
      }
      t = t.parentNode;
    }
  });
};

Controller.prototype.getMenuDrawerEventListeners = function() {
  return this.addMenuDrawerEventListeners;
};

Controller.prototype.addMenuDrawerEventListeners = function() {
  var that = this;
  this.delegate(document, "click", "#dismiss_menu_button", function(e) {
     let md = document.querySelector(".mdl-layout__drawer")
     if (md) {
       md.classList.remove("is-visible")
     }
     let modalObfuscator = document.querySelector(".mdl-layout__obfuscator")
     if (modalObfuscator) {
       modalObfuscator.classList.remove("is-visible")
     }
  });
  this.delegate(document, "click", "#view_values_button", function(e) {
    that.view.createPreferencesBody()
  });
  this.delegate(document, "click", "#view_cities_button", function(e) {
    that.view.createResultsBody()
  });
  this.delegate(document, "click", "#settings_edit_button", function(e) {
    that.view.createSettingsBody()
  });
  this.delegate(document, "click", "#settings_restore_button", function(e) {
    that.cityModel.restoreDefaultSettings()
    that.view.setMaxResults()  // TODO: really should be something like that.view.setState()
                               //       Should rebuild modal-occluded page to reflect restored state.
                               //       Really need an update-view entrypoint that.view.update()
                               //       React is calling since it handles this kind of shizzle. (-;
    if (that.cache.hasSettingsCB()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.removeAttribute("disabled")
      }
    }
  });
  this.delegate(document, "click", "#settings_clearcache_button", function(e) {
    if (that.cache.clearSettings()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.setAttribute("disabled", "disabled")
      }
    }
  });
};

Controller.prototype.getLandingPageEventListeners = function() {
  return this.addLandingPageEventListeners;
};

Controller.prototype.addLandingPageEventListeners = function() {
  nextButton = document.getElementById("navigate_next");
  nextPageAttr = nextButton.getAttribute("data-nextpage")

  console.log('nextPageAttr =', nextPageAttr)
  nextButton.addEventListener(
    "click",
    this.getNextButtonEventListener(
      this.view.createPreferencesBody.bind(this.view)
    )
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
};

Controller.prototype.getPreferencesPageEventListeners = function() {
  return this.addPreferencesPageEventListeners;
};

Controller.prototype.addPreferencesPageEventListeners = function() {
  nextButton = document.getElementById("navigate_next");

  nextButton.addEventListener(
    "click",
    this.getNextButtonEventListener(this.view.createResultsBody.bind(this.view))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();

  this.addSlideSwitchClassEventListener();
  this.addSliderEventListerners();
};

Controller.prototype.getSettingsPageEventListeners = function() {
  return this.addSettingsPageEventListeners;
};

Controller.prototype.addSettingsPageEventListeners = function() {
  nextButton = document.getElementById("navigate_next");
  nextPageAttr = nextButton.getAttribute("data-nextpage") || "landing"

  switch(nextPageAttr) {
    case "preferences":
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createPreferencesBody.bind(this.view))
      );
      break

    case "results":
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createResultsBody.bind(this.view))
      );
      break

    case "landing":
    default:
      nextButton.addEventListener(
        "click",
        this.getNextButtonEventListener(this.view.createLandingBody.bind(this.view))
      );
      break
  }

  maxResultsButtons = [...document.querySelectorAll(".settings-max-results__button")]
  maxResultsButtons.map(button => {
      let value = JSON.parse(button.getAttribute("data-value"))
      button.addEventListener(
        "click",
        (e) => {
           let buttonEl = e.srcElement
           let id = buttonEl.getAttribute("id")
           let attrValue = buttonEl.getAttribute("data-value") || "10"
           let value = JSON.parse(attrValue)
           if (this.settings.setMaxResults(value)) {
             //this.settings.saveLocalState()
             this.view.setMaxResults() // set view based upon model
                                       // TODO: This should go away once
                                       // observer pattern is implemented
                                       // in the model.
           }
           // console.log(`click show top ${value} cities`)
     });
  })

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
};

Controller.prototype.getResultsPageEventListeners = function() {
  return this.addResultsPageEventListeners;
};

Controller.prototype.addResultsPageEventListeners = function() {
  nextButton = document.getElementById("navigate_before");

  nextButton.addEventListener(
    "click",
    this.getNextButtonEventListener(
      this.view.createPreferencesBody.bind(this.view)
    )
  );

  viewButtons = document.getElementsByClassName("view-link");
  for (let i = 0; i < viewButtons.length; ++i) {
    let el = viewButtons[i];
    el.addEventListener("click", this.getViewButtonEventListener());
  }

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
};

Controller.prototype.getViewButtonEventListener = function() {
  let that = this;
  function innerFunction() {
    let theView = this.getAttribute("id");
    that.view.setActiveDataView(theView);
    that.view.createResultsBody();
  }
  return innerFunction;
};

Controller.prototype.getNextButtonEventListener = function(createBodyFn) {
  let that = this;
  function innerFunction() {
    createBodyFn();
  }
  return innerFunction;
};

Controller.prototype.addSlideSwitchClassEventListener = function() {
  var that = this;
  this.delegate(document, "click", ".mdl-switch__input", function(e) {
    let imgColorFilter = "";
    let switchId = this.getAttribute("id");
    if (that.switchIsEnabled(switchId)) {
      // Ignore the Job Outlook slide switch until I implement this feature.
      if (switchId == that.view.switchJobSearchId) {
        imgColorFilter = "grayscale(100%)"; // make JobSearch img always gray for now.
      } else {
        switch (switchId) {
          case that.view.switchHappinessId:
            that.priorities.setHappinessEnabled(true);
            break;
          case that.view.switchAffordabilityId:
            that.priorities.setAffordabilityEnabled(true);
            break;
          case that.view.switchPoliticsId:
            that.priorities.setPoliticsEnabled(true)
            break;
          // case that.view.switchJobSearchId:
          //   that.priorities.setJobSearchEnabled(true);
          //   break;
        }
        // console.log("checked");
        imgColorFilter = "grayscale(0%)"; // make image colorful
      }
    } else {
      switch (switchId) {
        case that.view.switchHappinessId:
          that.priorities.setHappinessEnabled(false);
          break;
        case that.view.switchAffordabilityId:
          that.priorities.setAffordabilityEnabled(false);
          break;
        case that.view.switchPoliticsId:
          that.priorities.setPoliticsEnabled(false);
          break;
        case that.view.switchJobSearchId:
          that.priorities.setJobSearchEnabled(false);
          break;
      }
      // console.log("not checked");
      imgColorFilter = "grayscale(100%)"; // make image black & white
    }
    // TODO: Fragile!  Walk DOM subtree and find childNode with
    //       class == ".mdl-card_title"
    let imgDiv = this.parentNode.parentNode.parentNode.childNodes[1];
    imgDiv.style.filter = imgColorFilter;
    console.log("user priorities known to view = ", that.priorities.getNormalizedPriorities())
  });
};

Controller.prototype.addSliderEventListerners = function() {
  let sliderH = document.getElementById(this.view.sliderHappinessId);
  sliderH.addEventListener("change", this.getPreferencesSliderHappinessCB());

  let sliderP = document.getElementById(this.view.sliderPoliticsId);
  sliderP.addEventListener("change", this.getPreferencesSliderPoliticsCB());

  let sliderA = document.getElementById(this.view.sliderAffordabilityId);
  sliderA.addEventListener(
    "change",
    this.getPreferencesSliderAffordabilityCB()
  );
};

Controller.prototype.getPreferencesSliderHappinessCB = function() {
  let that = this;
  function innerCB(event) {
    that.priorities.setHappinessValue(Number(this.value))
    // console.log("happiness value = ", this.value);
  }
  return innerCB;
};

Controller.prototype.getPreferencesSliderPoliticsCB = function() {
  let that = this;
  function innerCB(event) {
    let value = this.value;
    let republicanVal = Number(value);
    let democratVal = 100 - republicanVal;
    that.priorities.setPoliticsValue({rep16_frac: republicanVal, dem16_frac: democratVal})
    // console.log("politics value = ", value);
  }
  return innerCB;
};

Controller.prototype.getPreferencesSliderAffordabilityCB = function() {
  let that = this;
  function innerCB(event) {
    that.priorities.setAffordabilityValue(Number(this.value));
    // console.log("affordability value = ", this.value);
  }
  return innerCB;
};

Controller.prototype.getNextButtonEventListener = function(createBodyFn) {
  let that = this;
  function innerFunction() {
    createBodyFn();
  }
  return innerFunction;
};

Controller.prototype.switchIsEnabled = function(switchId) {
  return document.getElementById(switchId).checked == true;
};

