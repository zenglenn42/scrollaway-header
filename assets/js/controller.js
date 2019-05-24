function Controller(bodyDivId) {
  this.bodyDivId = bodyDivId;
  this.userPrefs = {
    happiness: this.happinessValue,
    affordability: this.affordabilityValue,
    politics: this.politicsValue
  };
  createLandingBody(bodyDivId);
}
// TODO: Derive midpoint values from data (especially for affordability).
Controller.prototype.affordabilityValue = 496501; // mid-point of median home price range
Controller.prototype.happinessValue = 50; // mid-point on 100 point scale
Controller.prototype.politicsValue = { rep16_frac: 50, dem16_frac: 50 };

function createHeader(title, rightNavIcon) {
  h = document.createElement("header");
  $(h).addClass("mdl-layout__header");
  $(h).html(`
    <div class="mdl-layout__header-row">
    <span class="mdl-layout-title">${title}</span>
    <div class="mdl-layout-spacer"></div>
      <i class="material-icons">${rightNavIcon}</i>
    </div>
  `);
  return h;
}

//-----------------------------------//
// Landing Page
//-----------------------------------//

function createLandingBody(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();
  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let landingText1 =
    "Considering a move but not sure which cities are your best bet?";
  let landingText2 =
    "Explore your options by sharing what's important to you and we'll offer some informed choices.";
  let mainLanding = createLandingMain(
    "Find your city",
    landingText1,
    landingText2
  );
  let footer = createFooter("navigate_next");

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);
  $(bodyDiv).append(mainLanding);
  $(bodyDiv).append(footer);
  nextButton = document.getElementById("navigate_next");

  $(nextButton).on("click", getLandingFabCB(bodyDivId));
  getStarted = document.getElementById("get-started");
  $(getStarted).on("click", getLandingFabCB(bodyDivId));

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
}

function createLandingMain(titleText, supportText1, supportText2) {
  m = document.createElement("main");
  $(m).addClass("content");
  $(m).attr("id", "main");
  $(m).html(`
    <div class="landing-card-wide mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">${titleText}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <p style="line-height: 1.25em;">${supportText1}</p>
        <p style="line-height: 1.25em;">${supportText2}</p>
      </div>
      <div class="mdl-card__actions mdl-card--border">
        <a id="get-started" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
          Get Started
        </a>
      </div>
      <div class="mdl-card__menu">
        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"></button>
      </div>
    </div>    
  `);
  return m;
}

//-----------------------------------//
// Preferences Page
//-----------------------------------//

function createPreferencesBody(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();
  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let mainPreferences = createPreferencesMain();
  let footer = createFooter("navigate_next");

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);
  $(bodyDiv).append(mainPreferences);
  $(bodyDiv).append(footer);

  nextButton = document.getElementById("navigate_next");
  $(nextButton).on("click", getPrefsFabCB(bodyDivId));

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
  createSlideSwitchListeners();
  $("#slider-happiness").on("change", getPreferencesSliderHappinessCB());
}

function createPreferencesMain() {
  m = document.createElement("main");
  $(m).addClass("mdl-layout__content");
  $(m).append('<div class="grid-content">');
  g = document.createElement("div");
  $(g).addClass("mdl-grid theGrid");
  $(m).append(g);

  let prefParams = {
    img: "assets/img/civic-happiness-sf.jpg",
    titleText: "Civic Happiness",
    id: "happiness",
    switchId: "switch-happiness",
    sliderId: "slider-happiness",
    iconClass: "far fa-lg pr-3",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  let c = createPreferencesSliderCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Political Affiliation",
    switchId: "switch-political-affiliation",
    sliderId: "slider-political-affiliation",
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = createPreferencesSliderCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Affordability",
    switchId: "switch-affordability",
    sliderId: "slider-affordability",
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = createPreferencesSliderCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    switchId: "switch-jobsearch",
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: false,
    prefLink: "",
    infoText: ""
  };
  c = createPreferencesTextinputCard(prefParams);
  $(g).append(c);

  return m;
}

function createPreferencesSliderCard(prefParams, isEnabled) {
  p = document.createElement("div");

  if (prefParams.titleText == "Affordability") {
    /* Hacky :-/ solution for getting double $$ on right side.      */
    /* Really, parameter icons should be array that I iterate over. */
    rightIconHTML = `
      <i class="${prefParams.iconClass} ${prefParams.rightSliderIcon}"
        aria-hidden="true">
      </i>
     <i class="${prefParams.iconClass} ${prefParams.rightSliderIcon}"
      aria-hidden="true">
     </i>
    `;
  } else {
    rightIconHTML = `
      <i class="${prefParams.iconClass} ${prefParams.rightSliderIcon}"
      aria-hidden="true">
      </i>
    `;
  }

  let blackWhiteImg = "";
  if (!prefParams.sliderEnabled) {
    blackWhiteImg = `filter: grayscale(100%);`;
  }

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${prefParams.img}') top/cover; ${blackWhiteImg}"
      >
        <h2
          class="mdl-card__title-text"
          style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
        >
          ${prefParams.titleText} &nbsp;<i class="material-icons">link</i>
        </h2>
      </div>
      <div class="mdl-card__supporting-text">
        <div class="mdl-slider__container">
          <i class="${prefParams.iconClass} ${prefParams.leftSliderIcon}"
            aria-hidden="true">
          </i>
          <input
            id=${prefParams.sliderId}
            class="mdl-slider mdl-js-slider"
            type="range"
            min=${prefParams.minSliderVal}
            max=${prefParams.maxSliderVal}
            value=${prefParams.curSliderVal}
            tabindex="0"
          />
          ${rightIconHTML}
        </div>
      </div>
      <div class="mdl-card__menu">
      </div>
    </div>
  `);
  let mdlSwitch = createSlideSwitch(
    prefParams.switchId,
    prefParams.sliderEnabled
  );
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  return p;
}

function createSlideSwitch(id, isChecked) {
  let label = document.createElement("label");
  label.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect");
  label.setAttribute("for", id);

  let checkbox = createCheckbox(id, isChecked);
  checkbox.setAttribute("class", "mdl-switch__input");
  componentHandler.upgradeElement(checkbox);

  label.appendChild(checkbox);
  componentHandler.upgradeElement(label);
  return label;
}

function createCheckbox(id, isChecked) {
  let cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.setAttribute("id", id);
  if (isChecked) {
    cb.setAttribute("checked", "");
  }
  return cb;
}

function createSlideSwitchListeners() {
  var that = this;
  $(document).on("change", ".mdl-switch__input", function(e) {
    let blackWhiteImg = "";
    if ($(this).is(":checked")) {
      // console.log("checked");
      blackWhiteImg = "grayscale(0%)";
    } else {
      // console.log("not checked");
      blackWhiteImg = "grayscale(100%)";
    }
    let imgDiv = $(this)
      .parent()
      .parent()
      .parent()
      .children(".mdl-card__title")[0];
    imgDiv.style.filter = blackWhiteImg;
  });
}

function getPreferencesSliderHappinessCB() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
    // that.userPrefs.happiness = value;
    console.log("happiness value = ", value);
  }
  return innerCB;
}

function createPreferencesTextinputCard(prefParams) {
  p = document.createElement("div");
  id = prefParams.titleText.toLowerCase().replace(" ", "-");
  console.log(id);

  let blackWhiteImgStyle = "";
  if (!prefParams.sliderEnabled) {
    blackWhiteImg = `filter: grayscale(100%);`;
  }

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${prefParams.img}') top/cover; ${blackWhiteImg}"
      >
        <h2
          class="mdl-card__title-text"
          style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
        >
          ${prefParams.titleText} &nbsp;<i class="material-icons">link</i>
        </h2>
      </div>
      <div class="mdl-card__supporting-text">
        <div class="md-form">
          <i class="${prefParams.iconClass} ${prefParams.icon}"
            aria-hidden="true">
          </i>
          <input
            type="text"
            id="${id}"
            class="form-control"
            placeholder="Job Title"
            disabled
          />
        </div>
      </div>
      <div class="mdl-card__menu">
      </div>
    </div>
  `);
  let mdlSwitch = createSlideSwitch(id, prefParams.sliderEnabled);
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  return p;
}

//-----------------------------------//
// Results Page
//-----------------------------------//

function createResultsBody(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();

  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let footer = createResultsFooter("navigate_before");
  let main = createResultsMain();

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);
  $(bodyDiv).append(main);
  $(bodyDiv).append(footer);

  nextButton = document.getElementById("navigate_before");
  $(nextButton).on("click", getResultsFabCB(bodyDivId));

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
}

function createResultsMain() {
  let m = document.createElement("main");
  $(m).addClass("mdl-layout__content");
  $(m).append('<div class="grid-content">');
  g = document.createElement("div");
  $(g).addClass("mdl-grid theGrid");
  $(m).append(g);

  let cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "Seattle",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  let c = createResultsCityCard(cityParams);
  $(g).append(c);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "Boston",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createResultsCityCard(cityParams);
  $(g).append(c);

  let monetizationParams = {
    img: "assets/img/monetize.jpg",
    titleText: "Monetize here",
    supportingText: "Advertise your move-related service here."
  };
  let monetize = createResultsMonetizeCard(monetizationParams);
  $(g).append(monetize);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "Austin",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createResultsCityCard(cityParams);
  $(g).append(c);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "New York",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createResultsCityCard(cityParams);
  $(g).append(c);
  return m;
}

function createResultsCityCard(cityParams) {
  p = document.createElement("div");
  id = cityParams.titleText.toLowerCase().replace(" ", "-");
  console.log(id);

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${cityParams.img}') top/cover"
      >
        <h2
          class="mdl-card__title-text"
          style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
        >
          ${cityParams.titleText} &nbsp;<i class="material-icons">link</i>
        </h2>
      </div>
      <div class="mdl-card__supporting-text">
        City stats ...
      </div>
      <div class="mdl-card__menu">
        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons">share</i>
        </button>
      </div>
    </div>
  `);
  return p;
}

function createResultsMonetizeCard(params) {
  p = document.createElement("div");
  id = params.titleText.toLowerCase().replace(" ", "-");
  console.log(id);

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${params.img}') bottom /cover"
      >
        <h2
          class="mdl-card__title-text"
          style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
        >
          ${params.titleText}
        </h2>
      </div>
      <div class="mdl-card__supporting-text">
        <!-- <p style="line-height: 1.25em;">${params.supportingText}</p> -->
        <div class="mdl-card__actions mdl-card--border">
          <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Learn More
          </a>
        </div>
        <!--
        <div class="mdl-card__menu">
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"></button>
        </div>
        -->
      </div>
    </div>
  `);
  return p;
}

function createResultsFooter(fabIcon) {
  f = document.createElement("footer");
  $(f).addClass("mdl-mini-footer");
  $(f).html(`
    <button id="navigate_before"
    class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary"
  >
    <i class="material-icons">${fabIcon}</i>
    </button>
    <div class="view-buttons">
        <div class="view-button" role="button" aria-expanded="false">
          <i class="material-icons">photo</i>
        </div>
        <div class="view-button" role="button" aria-expanded="false">
          <i class="material-icons">list</i>
        </div>
        <div
          role="button"
          aria-expanded="false"
          style="visibility: hidden; margin-left: 1em; margin-right: 1em;"
        >
          <i class="material-icons">place</i>
        </div>
        <div class="view-button" role="button" aria-expanded="false">
          <i class="material-icons">insert_chart</i>
        </div>
        <div class="view-button" role="button" aria-expanded="false">
          <i class="material-icons">map</i>
        </div>
      </div>
  `);
  return f;
}

function getLandingFabCB(div) {
  var that = this;
  var parentDiv = div;
  function innerFunction() {
    console.log("innerFunction: click");
    createPreferencesBody(parentDiv);
  }
  return innerFunction;
}

function getPrefsFabCB(div) {
  var that = this;
  var parentDiv = div;
  function innerFunction() {
    console.log("innerFunction: click");
    createResultsBody(parentDiv);
  }
  return innerFunction;
}

function getResultsFabCB(div) {
  var that = this;
  var parentDiv = div;
  function innerFunction() {
    console.log("innerFunction: click");
    createPreferencesBody(parentDiv);
  }
  return innerFunction;
}

function createHamburgerMenu() {
  m = document.createElement("div");
  $(m).addClass("mdl-layout__drawer-button");
  $(m).attr("role", "button");
  $(m).attr("aria-expanded", "false");
  $(m).append(`
    <i class="material-icons">menu</i>
  `);
  return m;
}

function createMenuDrawer(title, menuItemsArray) {
  md = document.createElement("div");
  $(md).addClass("mdl-layout__drawer");
  $(md).append(`
    <span class="mdl-layout-title">${title}</span>
  `);
  nav = document.createElement("nav");
  $(nav).addClass("mdl-navigation");
  let menuHtml = menuItemsArray.map(item => {
    return `<a class="mdl-navigation__link" href="">${item}</a>`;
  });
  menuHtml.map(html => {
    $(md).append(html);
  });
  return md;
}

function createFooter(fabIcon) {
  f = document.createElement("footer");
  $(f).addClass("mdl-mini-footer");
  $(f).html(`
    <button id="navigate_next" data-nextpage="preferences" class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary">
      <i class="material-icons">${fabIcon}</i>
    </button>
    <div class="mdl-mini-footer__left-section"><span class="copyright-text">
      <i class="material-icons footer-icons">location_city</i>
      <i class="material-icons footer-icons">favorite</i>
      <span class="copyright-text">Match Industries &copy; 2019</span>
    </div>
  `);
  return f;
}
