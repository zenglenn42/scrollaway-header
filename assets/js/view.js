function View(
  bodyDivId,
  addLandingPageEventListeners,
  addPreferencesPageEventListeners,
  addResultsPageEventListeners,
  getNextButtonEventListener,
  cityRankModelCB,
  minHappinessValue,
  midHappinessValue,
  maxHappinessValue,
  minAffordabilityValue,
  midAffordabilityValue,
  maxAffordabilityValue,
  midPoliticsValue,
  githubUrl
) {
  this.maxResults = 10;

  this.bodyDivId = bodyDivId;
  this.rankedList = [];
  this.addLandingPageEventListeners = addLandingPageEventListeners;
  this.addPreferencesPageEventListeners = addPreferencesPageEventListeners;
  this.addResultsPageEventListeners = addResultsPageEventListeners;
  this.getNextButtonEventListener = getNextButtonEventListener;

  this.cityRankModelCB = cityRankModelCB;
  this.minHappinessValue = minHappinessValue;
  this.maxHappinessValue = maxHappinessValue;
  this.minAffordabilityValue = minAffordabilityValue;
  this.maxAffordabilityValue = maxAffordabilityValue;
  this.githubUrl = githubUrl;

  this.userPrefs = {
    happinessEnabled: this.switchHappinessEnabledDefault,
    happiness: midHappinessValue,

    affordabilityEnabled: this.switchAffordabilityEnabledDefault,
    affordability: midAffordabilityValue,

    politicsEnabled: this.switchPoliticsEnabledDefault,
    politics: midPoliticsValue,

    jobSearchEnabled: this.switchJobSearchEnabledDefault
  };

  this.formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });
}

View.prototype.getStartedId = "get-started";

View.prototype.switchHappinessEnabledDefault = true;
View.prototype.switchHappinessId = "switch-happiness";
View.prototype.sliderHappinessId = "slider-happiness";

View.prototype.switchPoliticsEnabledDefault = true;
View.prototype.switchPoliticsId = "switch-political-affiliation";
View.prototype.sliderPoliticsId = "slider-politics";

View.prototype.switchAffordabilityEnabledDefault = true;
View.prototype.switchAffordabilityId = "switch-affordability";
View.prototype.sliderAffordabilityId = "slider-affordability";

View.prototype.switchJobSearchEnabledDefault = false;
View.prototype.switchJobSearchId = "switch-jobsearch";

View.prototype.setUserPrefs = function(userPrefs) {
  this.userPrefs = userPrefs;
};

View.prototype.createHeader = function(title, rightNavIcon) {
  let h = document.createElement("header");
  h.classList += "mdl-layout__header";
  h.innerHTML = `
      <div class="mdl-layout__header-row">
      <span class="mdl-layout-title">${title}</span>
      <div class="mdl-layout-spacer"></div>
        <i class="material-icons">${rightNavIcon}</i>
      </div>
    `;
  return h;
};

View.prototype.makeNav = function(bodyDiv, header, menuDrawer, hamburgerMenu) {
  bodyDiv.appendChild(header);
  bodyDiv.appendChild(menuDrawer);
  bodyDiv.appendChild(hamburgerMenu);
};

//-----------------------------------//
// Landing Page
//-----------------------------------//

View.prototype.createLandingBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  bodyDiv.innerHTML = "";

  let header = this.createHeader("City Match", "search");
  let menuDrawer = this.createMenuDrawer("Settings", [
    "About",
    "Contact",
    "Help"
  ]);
  let hamburgerMenu = this.createHamburgerMenu();
  let landingText1 =
    "Considering a move but not sure which cities are your best bet?";
  let landingText2 =
    "Explore your options by sharing what's important to you and we'll offer some informed choices.";
  let mainLanding = this.createLandingMain(
    "Find your city",
    landingText1,
    landingText2
  );
  let footer = this.createFooter("navigate_next");
  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu);
  bodyDiv.appendChild(mainLanding);
  bodyDiv.appendChild(footer);
  this.addLandingPageEventListeners();
};

View.prototype.createLandingMain = function(
  titleText,
  supportText1,
  supportText2
) {
  let m = document.createElement("main");
  m.classList.add("content");
  m.setAttribute("id", "main");
  m.innerHTML = `
      <div class="landing-card-wide mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title">
          <h2 class="mdl-card__title-text">${titleText}</h2>
        </div>
        <div class="mdl-card__supporting-text" style="overflow: scroll">
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
    `;
  return m;
};

//-----------------------------------//
// Preferences Page
//-----------------------------------//

View.prototype.createPreferencesBody = function createPreferencesBody() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  bodyDiv.innerHTML = "";
  let header = this.createHeader("City Match", "search");
  let menuDrawer = this.createMenuDrawer("Settings", [
    "About",
    "Contact",
    "Help"
  ]);
  let hamburgerMenu = this.createHamburgerMenu();
  let mainPreferences = this.createPreferencesMain();
  let footer = this.createFooter("navigate_next");

  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu);
  bodyDiv.appendChild(mainPreferences);
  bodyDiv.appendChild(footer);

  this.addPreferencesPageEventListeners();
};

View.prototype.createPreferencesMain = function() {
  let m = document.createElement("main");
  m.classList.add("mdl-layout__content");
  // let child = document.createElement(`<div class="grid-content">`);
  let child = document.createElement("div");
  child.classList.add("grid-content");
  m.appendChild(child);
  let g = document.createElement("div");
  g.classList.add("mdl-grid");
  g.classList.add("theGrid");
  m.appendChild(g);

  let prefParams = {
    img: "assets/img/civic-happiness-sf.jpg",
    titleText: "Civic Happiness",
    id: "happiness",
    switchId: `${this.switchHappinessId}`,
    sliderId: `${this.sliderHappinessId}`,
    sliderContainerId: `${this.sliderHappinessId}-container`,
    iconClass: "far fa-lg pr-3",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: this.minHappinessValue,
    maxSliderVal: this.maxHappinessValue,
    curSliderVal: this.userPrefs.happiness,
    sliderEnabled: this.userPrefs.happinessEnabled,
    prefLink: "",
    infoText: ""
  };
  let c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  let curPoliticsVal = this.userPrefs.politics.rep16_frac;
  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Political Affiliation",
    switchId: `${this.switchPoliticsId}`,
    sliderId: `${this.sliderPoliticsId}`,
    sliderContainerId: `${this.sliderPoliticsId}-container`,
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: `${curPoliticsVal}`,
    sliderEnabled: this.userPrefs.politicsEnabled,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Affordability",
    switchId: `${this.switchAffordabilityId}`,
    sliderId: `${this.sliderAffordabilityId}`,
    sliderContainerId: `${this.sliderAffordabilityId}-container`,
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: this.minAffordabilityValue,
    maxSliderVal: this.maxAffordabilityValue,
    curSliderVal: this.userPrefs.affordability,
    sliderEnabled: this.userPrefs.affordabilityEnabled,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    switchId: `${this.switchJobSearchId}`,
    inputId: "input-jobsearch",
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: this.userPrefs.jobSearchEnabled,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesTextinputCard(prefParams);
  g.appendChild(c);

  return m;
};

View.prototype.createPreferencesSliderCard = function(prefParams, isEnabled) {
  let p = document.createElement("div");

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

  let colorFilter = "";
  if (!prefParams.sliderEnabled) {
    colorFilter = `filter: grayscale(100%);`;
  }

  p.classList.add("mdl-cell");
  p.classList.add("preference-cell");
  p.classList.add("mdl-cell--3-col");
  p.innerHTML = `
      <div class="preference-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${prefParams.img}') top/cover; ${colorFilter}"
        >
          <h2
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
          >
            ${prefParams.titleText} &nbsp;<i class="material-icons">link</i>
          </h2>
        </div>
        <div class="mdl-card__supporting-text">
          <div id=${prefParams.sliderContainerId} class="mdl-slider__container">
            <i class="${prefParams.iconClass} ${prefParams.leftSliderIcon}"
              aria-hidden="true">
            </i>
            <input
              id=${prefParams.sliderId}
              class="enhanced-slider mdl-slider mdl-js-slider"
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
    `;
  let mdlSwitch = this.createSlideSwitch(
    prefParams.switchId,
    prefParams.sliderEnabled
  );
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  return p;
};

View.prototype.createSlideSwitch = function(id, isChecked) {
  let label = document.createElement("label");
  label.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect");
  label.setAttribute("for", id);

  let checkbox = this.createCheckbox(id, isChecked);
  checkbox.setAttribute("class", "mdl-switch__input");
  componentHandler.upgradeElement(checkbox);

  label.appendChild(checkbox);
  componentHandler.upgradeElement(label);
  return label;
};

View.prototype.createCheckbox = function(id, isChecked) {
  let cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.setAttribute("id", id);
  if (isChecked) {
    cb.setAttribute("checked", "");
  }
  return cb;
};

View.prototype.createPreferencesTextinputCard = function(prefParams) {
  let p = document.createElement("div");

  let colorFilterStyle = "";
  if (prefParams.sliderEnabled) {
    colorFilter = `filter: grayscale(0%);`;
  } else {
    colorFilter = `filter: grayscale(100%);`;
  }

  p.classList.add("mdl-cell");
  p.classList.add("preference-cell");
  p.classList.add("mdl-cell--3-col");
  p.innerHTML = `
      <div class="preference-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${prefParams.img}') top/cover; ${colorFilter}"
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
              id="${prefParams.inputId}"
              class="form-control"
              placeholder="Job Title"
              disabled
            />
          </div>
        </div>
        <div class="mdl-card__menu">
        </div>
      </div>
    `;
  let mdlSwitch = this.createSlideSwitch(
    prefParams.switchId,
    prefParams.sliderEnabled
  );
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  return p;
};

//-----------------------------------//
// Results Page
//-----------------------------------//

View.prototype.createResultsBody = function createResultsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  bodyDiv.innerHTML = "";
  let header = this.createHeader("City Match", "search");
  let menuDrawer = this.createMenuDrawer("Settings", [
    "About",
    "Contact",
    "Help"
  ]);
  let hamburgerMenu = this.createHamburgerMenu();
  let footer = this.createResultsFooter("navigate_before");
  let main = this.createResultsMain();

  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu);
  bodyDiv.appendChild(main);
  bodyDiv.appendChild(footer);

  this.addResultsPageEventListeners();
};

View.prototype.createResultsMain = function() {
  let m = document.createElement("main");
  m.classList.add("mdl-layout__content");
  let child = document.createElement("div");
  child.classList.add("grid-content");
  m.appendChild(child);
  let g = document.createElement("div");
  g.classList.add("mdl-grid");
  g.classList.add("theGrid");
  m.appendChild(g);
  computedUserPrefs = this.getComputedUserPrefs();
  if (this.noUserPreferences(computedUserPrefs)) {
    let noPrefsParams = {
      img: "assets/img/chess-failure.jpg",
      titleText: "No results available.",
      supportingText: "Please go back and specify one or more preferences."
    };
    let c = this.createResultsNoPrefsCard(noPrefsParams);
    g.appendChild(c);
  } else {
    //-----------------------------------//
    // Call the model to get ranked list
    // of cities sorted by user preference.
    //-----------------------------------//
    console.log("computed prefs passed to model =", computedUserPrefs);
    this.rankedList = this.cityRankModelCB(computedUserPrefs);

    this.rankedList.length = this.maxResults;
    let rank = 1;
    let monetizationPosition1 = 3;
    let monetizationPosition2 = 8;
    this.rankedList.map(cityData => {
      if (rank == monetizationPosition1 || rank == monetizationPosition2) {
        let monetizeParams = {
          img: "assets/img/monetize.jpg",
          titleText: "Monetize here $"
        };
        let mc = this.createResultsMonetizeCard(monetizeParams);
        g.appendChild(mc);
      }
      let cityParams = this.marshallModelData(rank++, cityData);
      let c = this.createResultsCityCard(cityParams);
      g.appendChild(c);
    });
  }
  return m;
};

View.prototype.getComputedUserPrefs = function() {
  let userPrefs = {};
  if (this.userPrefs.happinessEnabled) {
    userPrefs.happiness = parseInt(this.userPrefs.happiness);
  } else {
    userPrefs.happiness = NaN;
  }
  if (this.userPrefs.affordabilityEnabled) {
    userPrefs.affordability = parseInt(this.userPrefs.affordability);
  } else {
    userPrefs.affordability = NaN;
  }
  if (this.userPrefs.politicsEnabled) {
    userPrefs.politics = this.userPrefs.politics;
    userPrefs.politics.dem16_frac = parseInt(userPrefs.politics.dem16_frac);
    userPrefs.politics.rep16_frac = parseInt(userPrefs.politics.rep16_frac);
  } else {
    nanPolitics = { rep16_frac: NaN, dem16_frac: NaN };
    userPrefs.politics = nanPolitics;
  }
  return userPrefs;
};

View.prototype.noUserPreferences = function(userPrefs) {
  return (
    isNaN(userPrefs.happiness) &&
    isNaN(userPrefs.affordability) &&
    isNaN(userPrefs.politics.rep16_frac)
  );
};

View.prototype.marshallModelData = function(rank, cityData) {
  let cityParams = {};
  let cityProperties = Object.values(cityData);
  // console.log(cityProperties[0].img["imgSrc"]);
  let cityName = Object.keys(cityData)[0];
  cityParams.rank = rank;
  if (cityProperties[0].img) {
    cityParams.img = cityProperties[0].img["imgSrc"];
  } else {
    cityParams.img = "https://placehold.it/300x150";
  }
  cityParams.titleText = cityName.replace(/['"]+/g, "");
  cityParams.happiness = cityProperties[0].happiness;
  cityParams.affordability = cityProperties[0].affordability;
  cityParams.politics = {
    demFraction: cityProperties[0].politics.dem16_frac.toFixed(0),
    repFraction: cityProperties[0].politics.rep16_frac.toFixed(0)
  };
  cityParams.jobOutlook = 42;
  return cityParams;
};

View.prototype.createResultsCityCard = function(cityParams) {
  let p = document.createElement("div");

  let donkey =
    '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>';
  let elephant =
    '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>';
  let politics = `${donkey}${
    cityParams.politics.demFraction
  }%  &nbsp; ${elephant}${cityParams.politics.repFraction}%`;
  let affordability = this.formatter.format(cityParams.affordability);
  let cityStats = `<p>Civic Happiness:  ${
    cityParams.happiness
  }</br> Median Home Price: ${affordability}</br> ${politics}</p>`;

  // &nbsp;<i class="material-icons">link</i>
  // preference-card-square
  p.classList.add("mdl-cell");
  p.classList.add("results-cell");
  p.classList.add("mdl-cell--3-col");
  p.innerHTML = `
      <div class="results-card mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${cityParams.img}') top/cover"
        >
          <h2
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.2em; background-color: rgba(6,6,6,0.6)"
          >
            ${cityParams.rank}. ${cityParams.titleText}
          </h2>
        </div>
        <div class="mdl-card__supporting-text">
          ${cityStats}
        </div>
        <div class="mdl-card__menu">
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">favorite_border</i>
          </button>
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">share</i>
          </button>
        </div>
      </div>
    `;
  return p;
};

View.prototype.createResultsMonetizeCard = function(params) {
  let p = document.createElement("div");
  p.classList.add("mdl-cell");
  p.classList.add("preference-cell");
  p.classList.add("mdl-cell--3-col");
  p.innerHTML = `
      <div class="results-card mdl-card mdl-shadow--3dp">
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
    `;
  return p;
};

View.prototype.createResultsNoPrefsCard = function(params) {
  let p = document.createElement("div");
  p.classList.add("mdl-cell");
  p.classList.add("preference-cell");
  p.classList.add("mdl-cell--3-col");
  p.innerHTML = `
      <div class="results-card mdl-card mdl-shadow--3dp">
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
          <p style="line-height: 1.25em;">${params.supportingText}</p>
          <!--
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"></button>
          </div>
          -->
        </div>
      </div>
    `;
  return p;
};

View.prototype.createResultsFooter = function(fabIcon) {
  let f = document.createElement("footer");
  f.classList.add("mdl-mini-foote");
  f.innerHTML = `
      <button id="navigate_before"
      class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary"
    >
      <i class="material-icons">${fabIcon}</i>
      </button>
      <div class="view-buttons mdl-tabs mdl-js-tabs">
        <div class="mdl-tabs__tab-bar">
          <a href="#tab1" class="mdl-tabs__tab is-active">
            <div id="tab1" class="view-button" role="button" aria-expanded="false">
              <i class="material-icons">photo</i>
            </div>
          </a>
          <a href="#tab2" class="mdl-tabs__tab">
            <div id="tab2" class="view-button" role="button" aria-expanded="false">
              <i class="material-icons">list</i>
            </div>
          </a>
          <a href="#tab3" class="mdl-tabs__tab" style="visibility: hidden">
            <div
            role="button"
            aria-expanded="false"
            style="visibility: hidden; margin-left: 1.5em; margin-right: 1.5em;"
          >
              <i class="material-icons">place</i>
            </div>
          </a>
          <a href="#tab4" class="mdl-tabs__tab">
            <div id="tab4" class="view-button" role="button" aria-expanded="false">
              <i class="material-icons">insert_chart</i>
            </div>
          </a>
          <a href="#tab5" class="mdl-tabs__tab">
            <div id="tab5" class="view-button" role="button" aria-expanded="false">
              <i class="material-icons">map</i>
            </div>
          </a>
        </div>
      </div>
    `;
  return f;
};

View.prototype.createHamburgerMenu = function() {
  let m = document.createElement("div");
  m.classList.add("mdl-layout__drawer-button");
  m.setAttribute("role", "button");
  m.setAttribute("aria-expanded", "false");
  let iconEl = document.createElement("i");
  iconEl.classList.add("material-icons");
  iconEl.innerHTML = "menu";
  m.appendChild(iconEl);
  return m;
};

View.prototype.createMenuDrawer = function(title, menuItemsArray) {
  let md = document.createElement("div");
  md.classList.add("mdl-layout__drawer");
  let mdChild = document.createElement("span");
  mdChild.classList.add("mdl-layout-title");
  mdChild.innerHTML = title;
  md.appendChild(mdChild);
  let nav = document.createElement("nav");
  nav.classList.add("mdl-navigation");
  // $(nav).addClass("mdl-navigation");
  let menuHtml = menuItemsArray.map(item => {
    let anchor = document.createElement("a");
    anchor.classList.add("mdl-navigation__link");
    anchor.setAttribute("href", "");
    anchor.innerHTML = `${item}`;
    return anchor;
    // return `<a class="mdl-navigation__link" href="">${item}</a>`;
  });
  menuHtml.map(html => {
    md.appendChild(html);
  });
  return md;
};

View.prototype.createFooter = function(fabIcon) {
  f = document.createElement("footer");
  f.classList.add("mdl-mini-footer");
  f.innerHTML = `
      <button id="navigate_next" data-nextpage="preferences" class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary">
        <i class="material-icons">${fabIcon}</i>
      </button>
      <div class="mdl-mini-footer__left-section"><span class="copyright-text">
        <i class="material-icons footer-icons">location_city</i>
        <i class="material-icons footer-icons">favorite</i>
        <span class="copyright-text">City Match &copy; 2019</span>
      </div>
      <div class="mdl-mini-footer__right-section">
        <a href="${this.githubUrl}" target="_blank">
          <button id="button-octocat" data-nextpage="preferences" class="mdl-button mdl-js-button mdl-js-ripple-effect">
            <i id="icon-octocat" class="fab fa-github-square" aria-hidden="true"></i>
          </button>
        </a>
      </div>
    `;
  return f;
};
