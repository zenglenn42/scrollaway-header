Controller.prototype.getResultsPageEventListeners = function() {
  return this.addResultsPageEventListeners;
};

Controller.prototype.addResultsPageEventListeners = function() {
  nextButton = document.getElementById("navigate_before");

  nextButton.addEventListener(
    "click",
    this.getNextButtonEventListener(
      this.view.createPrioritiesBody.bind(this.view)
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
