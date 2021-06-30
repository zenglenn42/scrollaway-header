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
      this.view.createPrioritiesBody.bind(this.view)
    )
  );
}
