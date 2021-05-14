function Controller(bodyDivId) {
  this.model = new Model();

  this.view = new View(
    bodyDivId,
    this.getMenuDrawerEventListeners().bind(this),
    this.getLandingPageEventListeners().bind(this),
    this.getPreferencesPageEventListeners().bind(this),
    this.getResultsPageEventListeners().bind(this),
    this.getSettingsPageEventListeners().bind(this),
    this.model.getCityRankCB().bind(this.model),
    this.model.getMinHappinessValue(),
    this.model.getMidHappinessValue(),
    this.model.getMaxHappinessValue(),
    this.model.getMinAffordabilityValue(),
    this.model.getMidAffordabilityValue(),
    this.model.getMaxAffordabilityValue(),
    this.model.getMidPoliticsValue(),
    this.model.githubUrl,
    this.model.hasCachedLocalStateCB().bind(this.model),
    this.model.getMaxResultsCB().bind(this.model)
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
    that.model.restoreDefaultSettings()
    if (that.model.hasCachedLocalStateCB()) {
      let clearcache_button = document.querySelector("#settings_clearcache_button")
      if (clearcache_button) {
        clearcache_button.removeAttribute("disabled")
      }
    }
  });
  this.delegate(document, "click", "#settings_clearcache_button", function(e) {
    if (that.model.clearLocalStorage()) {
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
            that.view.userPrefs.happinessEnabled = true;
            break;
          case that.view.switchAffordabilityId:
            that.view.userPrefs.affordabilityEnabled = true;
            break;
          case that.view.switchPoliticsId:
            that.view.userPrefs.politicsEnabled = true;
            break;
          // case that.view.switchJobSearchId:
          //   that.userPrefs.jobSearchEnabled = true;
          //   break;
        }
        // console.log("checked");
        imgColorFilter = "grayscale(0%)"; // make image colorful
      }
    } else {
      switch (switchId) {
        case that.view.switchHappinessId:
          that.view.userPrefs.happinessEnabled = false;
          break;
        case that.view.switchAffordabilityId:
          that.view.userPrefs.affordabilityEnabled = false;
          break;
        case that.view.switchPoliticsId:
          that.view.userPrefs.politicsEnabled = false;
          break;
        case that.view.switchJobSearchId:
          that.view.userPrefs.jobSearchEnabled = false;
          break;
      }
      // console.log("not checked");
      imgColorFilter = "grayscale(100%)"; // make image black & white
    }
    // TODO: Fragile!  Walk DOM subtree and find childNode with
    //       class == ".mdl-card_title"
    let imgDiv = this.parentNode.parentNode.parentNode.childNodes[1];
    imgDiv.style.filter = imgColorFilter;
    console.log("user prefs known to view = ", that.view.userPrefs);
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
    that.view.userPrefs.happiness = this.value;
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
    that.view.userPrefs.politics = {
      rep16_frac: republicanVal,
      dem16_frac: democratVal
    };
    // console.log("politics value = ", value);
  }
  return innerCB;
};

Controller.prototype.getPreferencesSliderAffordabilityCB = function() {
  let that = this;
  function innerCB(event) {
    that.view.userPrefs.affordability = this.value;
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

