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

function createResultsFooter(fabIcon) {
  f = document.createElement("footer");
  $(f).addClass("mdl-mini-footer");
  $(f).html(`
    <button
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
  let c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Political Affiliation",
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
  c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Affordability",
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
  c = createSliderPrefCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
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
          <i class="${prefParams.iconClass} ${prefParams.leftSliderIcon}"
            aria-hidden="true">
          </i>
          <input
            class="mdl-slider mdl-js-slider"
            type="range"
            min=${prefParams.minSliderVal}
            max=${prefParams.maxSliderVal}
            value=${prefParams.curSliderVal}
            tabindex="0"
          />
          ${rightIconHTML}
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
  let footer = createResultsFooter("navigate_before");

  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);

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

  let monetizationParams = {
    img: "assets/img/monetize.jpg",
    titleText: "Monetize here",
    supportingText: "Advertise your move-related service here."
  };
  let monetize = createMonetizationCard(monetizationParams);
  $(g).append(monetize);

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

function createMonetizationCard(params) {
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
