function Controller(bodyDivId) {
  this.model = new Model();

  this.view = new View(
    bodyDivId,
    this.getLandingPageEventListeners().bind(this),
    this.getPreferencesPageEventListeners().bind(this),
    this.getResultsPageEventListeners().bind(this),
    this.getNextButtonEventListener().bind(this),
    this.model.getCityRankCB().bind(this.model),
    this.model.getMinHappinessValue(),
    this.model.getMidHappinessValue(),
    this.model.getMaxHappinessValue(),
    this.model.getMinAffordabilityValue(),
    this.model.getMidAffordabilityValue(),
    this.model.getMaxAffordabilityValue(),
    this.model.getMidPoliticsValue(),
    this.model.githubUrl
  );
  this.view.createLandingBody();
}

Controller.prototype.getLandingPageEventListeners = function() {
  return this.addLandingPageEventListeners;
};

Controller.prototype.addLandingPageEventListeners = function() {
  nextButton = document.getElementById("navigate_next");

  $(nextButton).on(
    "click",
    this.getNextButtonEventListener(
      this.view.createPreferencesBody.bind(this.view)
    )
  );
  getStarted = document.getElementById(this.view.getStartedId);
  $(getStarted).on(
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

  $(nextButton).on(
    "click",
    this.getNextButtonEventListener(this.view.createResultsBody.bind(this.view))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();

  this.addSlideSwitchClassEventListener();
  this.addSliderEventListerners();
};

Controller.prototype.getResultsPageEventListeners = function() {
  return this.addResultsPageEventListeners;
};

Controller.prototype.addResultsPageEventListeners = function() {
  nextButton = document.getElementById("navigate_before");

  $(nextButton).on(
    "click",
    this.getNextButtonEventListener(
      this.view.createPreferencesBody.bind(this.view)
    )
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
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
  $(document).on("change", ".mdl-switch__input", function(e) {
    let imgColorFilter = "";
    let switchId = $(this).attr("id");
    if ($(this).is(":checked")) {
      // Ignore the Job Outlook slide switch until I implement this feature.
      if (switchId == that.switchJobSearchId) {
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
    let imgDiv = $(this)
      .parent()
      .parent()
      .parent()
      .children(".mdl-card__title")[0];
    imgDiv.style.filter = imgColorFilter;
    console.log("user prefs known to view = ", that.view.userPrefs);
  });
};

Controller.prototype.addSliderEventListerners = function() {
  $(`#${this.view.sliderHappinessId}`).on(
    "change",
    this.getPreferencesSliderHappinessCB()
  );
  $(`#${this.view.sliderPoliticsId}`).on(
    "change",
    this.getPreferencesSliderPoliticsCB()
  );
  $(`#${this.view.sliderAffordabilityId}`).on(
    "change",
    this.getPreferencesSliderAffordabilityCB()
  );
};

Controller.prototype.getPreferencesSliderHappinessCB = function() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
    that.view.userPrefs.happiness = value;
    // console.log("happiness value = ", value);
  }
  return innerCB;
};

Controller.prototype.getPreferencesSliderPoliticsCB = function() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
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
    let value = $(this)[0].value;
    that.view.userPrefs.affordability = value;
    // console.log("affordability value = ", value);
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
