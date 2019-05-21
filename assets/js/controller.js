function Controller(bodyDivId) {
  createLandingHTML(bodyDivId);
  // createPreferencesHTML(bodyDivId);
  // createResultsHTML(bodyDivId);
}

function createLandingHTML(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();
  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let landingText1 =
    "Considering a move but not sure which cities are your best bet?";
  let landingText2 =
    "Explore your options by sharing what's important to you and we'll offer some informed choices.";
  let mainLanding = createMainLanding(
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
}

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

function createMainLanding(titleText, supportText1, supportText2) {
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
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
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

function createPreferencesHTML(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();
  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let mainPreferences = createMainPreferences();
  let footer = createFooter("navigate_next");

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);
  $(bodyDiv).append(mainPreferences);
  $(bodyDiv).append(footer);
}

function createMainPreferences() {
  m = document.createElement("main");
  $(m).addClass("mdl-layout__content");
  $(m).append('<div class="grid-content">');
  g = document.createElement("div");
  $(g).addClass("mdl-grid theGrid");
  $(m).append(g);

  let prefParams = {
    img: "assets/img/civic-happiness-sf.jpg",
    titleText: "Civic Happiness",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  let c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Political Affiliation",
    leftSliderIcon: "fa-democrat",
    rightSliderIcon: "fa-republican",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Affordability",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: "50",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    titleText: "Job Outlook",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = createTextPrefCard(prefParams);
  $(g).append(c);

  return m;
}

function createSliderPrefCard(prefParams) {
  p = document.createElement("div");
  id = prefParams.titleText.toLowerCase().replace(" ", "-");
  console.log(id);

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${prefParams.img}') top/cover"
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
          <i class="far ${
            prefParams.leftSliderIcon
          } fa-lg pr-3" aria-hidden="true"></i>
          <input
            class="mdl-slider mdl-js-slider"
            type="range"
            min=${prefParams.minSliderVal}
            max=${prefParams.maxSliderVal}
            value=${prefParams.curSliderVal}
            tabindex="0"
          />
          <i class="far ${
            prefParams.rightSliderIcon
          } fa-lg pr-3" aria-hidden="true"></i>
        </div>
        <label
          class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
          for="switch-${id}"
        >
          <input
            type="checkbox"
            id="switch-${id}"
            class="mdl-switch__input"
          />
        </label>
      </div>
    </div>
  `);
  return p;
}

function createTextPrefCard(prefParams) {
  p = document.createElement("div");
  id = prefParams.titleText.toLowerCase().replace(" ", "-");
  console.log(id);

  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
    <div class="preference-card-square mdl-card mdl-shadow--3dp">
      <div
        class="mdl-card__title mdl-card--expand"
        style="background: url('${prefParams.img}') top/cover"
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
          <i class="far ${prefParams.icon} fa-lg pr-3" aria-hidden="true"></i>
          <input
            type="text"
            id="${id}"
            class="form-control"
            placeholder="Job Title"
            disabled
          />
        </div>
        <label
          class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
          for="switch-${id}"
        >
          <input
            type="checkbox"
            id="switch-${id}"
            class="mdl-switch__input"
          />
        </label>
      </div>
    </div>
  `);
  return p;
}

function createResultsHTML(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  $(bodyDiv).empty();

  let header = createHeader("City Match", "search");
  let menuDrawer = createMenuDrawer("Settings", ["About", "Contact", "Help"]);
  let hamburgerMenu = createHamburgerMenu();
  let footer = createFooter("navigate_before");

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);

  m = document.createElement("main");
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
  let c = createCityCard(cityParams);
  $(g).append(c);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "Boston",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createCityCard(cityParams);
  $(g).append(c);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "Austin",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createCityCard(cityParams);
  $(g).append(c);

  cityParams = {
    img: "https://placehold.it/300x150",
    titleText: "New York",
    happiness: 50,
    politics: 25,
    affordability: 34,
    jobOutlook: 5
  };
  c = createCityCard(cityParams);
  $(g).append(c);
  $(bodyDiv).append(m);
  $(bodyDiv).append(footer);
}

function createCityCard(cityParams) {
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
    </div>
  `);
  return p;
}
