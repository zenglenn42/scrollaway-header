Controller.prototype.getPrioritiesPageEventListeners = function() {
  return this.addPrioritiesPageEventListeners;
};

Controller.prototype.addPrioritiesPageEventListeners = function() {
  nextButton = document.getElementById("navigate_next");

  nextButton.addEventListener(
    "click",
    this.getNextButtonEventListener(this.view.createResultsBody.bind(this.view))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();

  this.addSlideSwitchClassEventListener();
  this.addSliderEventListeners();
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

Controller.prototype.addSliderEventListeners = function() {
  let sliderH = document.getElementById(this.view.sliderHappinessId);
  sliderH.addEventListener("change", this.getPrioritiesSliderHappinessCB());

  let sliderP = document.getElementById(this.view.sliderPoliticsId);
  sliderP.addEventListener("change", this.getPrioritiesSliderPoliticsCB());

  let sliderA = document.getElementById(this.view.sliderAffordabilityId);
  sliderA.addEventListener(
    "change",
    this.getPrioritiesSliderAffordabilityCB()
  );
};

Controller.prototype.getPrioritiesSliderHappinessCB = function() {
  let that = this;
  function innerCB(event) {
    that.priorities.setHappinessValue(Number(this.value))
    // console.log("happiness value = ", this.value);
  }
  return innerCB;
};

Controller.prototype.getPrioritiesSliderPoliticsCB = function() {
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

Controller.prototype.getPrioritiesSliderAffordabilityCB = function() {
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
