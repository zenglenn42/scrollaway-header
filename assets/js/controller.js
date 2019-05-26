function Controller(bodyDivId) {
  this.cr = new Model();
  this.bodyDivId = bodyDivId;
  this.rankedList = [];
  this.userPrefs = {
    happiness: this.happinessValue,
    affordability: this.affordabilityValue,
    politics: this.politicsValue
  };
  this.formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });
  this.createLandingBody();
}
// TODO: Derive midpoint values from data (especially for affordability).
Controller.prototype.affordabilityValue = 504950; // mid-point of median home price range
Controller.prototype.happinessValue = 51; // mid-point on 100 point scale
Controller.prototype.politicsValue = { rep16_frac: 50, dem16_frac: 50 };

Controller.prototype.createHeader = function(title, rightNavIcon) {
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
};

Controller.prototype.makeNav = function(
  bodyDiv,
  header,
  menuDrawer,
  hamburgerMenu
) {
  $(bodyDiv).append(header);
  $(bodyDiv).append(menuDrawer);
  $(bodyDiv).append(hamburgerMenu);
};

//-----------------------------------//
// Landing Page
//-----------------------------------//

Controller.prototype.createLandingBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  $(bodyDiv).empty();
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
  $(bodyDiv).append(mainLanding);
  $(bodyDiv).append(footer);
  nextButton = document.getElementById("navigate_next");

  $(nextButton).on(
    "click",
    this.getNextButtonCB(this.createPreferencesBody.bind(this))
  );
  getStarted = document.getElementById("get-started");
  $(getStarted).on(
    "click",
    this.getNextButtonCB(this.createPreferencesBody.bind(this))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
};

Controller.prototype.createLandingMain = function(
  titleText,
  supportText1,
  supportText2
) {
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
};

//-----------------------------------//
// Preferences Page
//-----------------------------------//

Controller.prototype.createPreferencesBody = function createPreferencesBody() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  $(bodyDiv).empty();
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
  $(bodyDiv).append(mainPreferences);
  $(bodyDiv).append(footer);

  nextButton = document.getElementById("navigate_next");
  $(nextButton).on(
    "click",
    this.getNextButtonCB(this.createResultsBody.bind(this))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
  this.createSlideSwitchListeners();
  $("#slider-happiness").on("change", this.getPreferencesSliderHappinessCB());
  $("#slider-politics").on("change", this.getPreferencesSliderPoliticsCB());
  $("#slider-affordability").on(
    "change",
    this.getPreferencesSliderAffordabilityCB()
  );
};

Controller.prototype.createPreferencesMain = function() {
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
    minSliderVal: "29",
    maxSliderVal: "73",
    curSliderVal: this.userPrefs.happiness,
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  let c = this.createPreferencesSliderCard(prefParams);
  $(g).append(c);

  let curPoliticsVal = this.userPrefs.politics.rep16_frac;
  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Political Affiliation",
    switchId: "switch-political-affiliation",
    sliderId: "slider-politics",
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: `${curPoliticsVal}`,
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesSliderCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Affordability",
    switchId: "switch-affordability",
    sliderId: "slider-affordability",
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: "82500",
    maxSliderVal: "927400",
    curSliderVal: this.userPrefs.affordability,
    sliderEnabled: true,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesSliderCard(prefParams);
  $(g).append(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    switchId: "switch-jobsearch",
    inputId: "input-jobsearch",
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: false,
    prefLink: "",
    infoText: ""
  };
  c = this.createPreferencesTextinputCard(prefParams);
  $(g).append(c);

  return m;
};

Controller.prototype.createPreferencesSliderCard = function(
  prefParams,
  isEnabled
) {
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
  `);
  let mdlSwitch = this.createSlideSwitch(
    prefParams.switchId,
    prefParams.sliderEnabled
  );
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  return p;
};

Controller.prototype.createSlideSwitch = function(id, isChecked) {
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

Controller.prototype.createCheckbox = function(id, isChecked) {
  let cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.setAttribute("id", id);
  if (isChecked) {
    cb.setAttribute("checked", "");
  }
  return cb;
};

Controller.prototype.createSlideSwitchListeners = function() {
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
};

Controller.prototype.getPreferencesSliderHappinessCB = function() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
    that.userPrefs.happiness = value;
    console.log("happiness value = ", value);
  }
  return innerCB;
};

Controller.prototype.setPreferenceSliderHappiness = function(value) {
  let slider = document.getElementById("slider-happiness");
  slider.value = value;
};

Controller.prototype.getPreferencesSliderPoliticsCB = function() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
    // document.getElementById("pol-slider-status").innerHTML = value;
    let republicanVal = Number(value);
    let democratVal = 100 - republicanVal;
    that.userPrefs.politics = {
      rep16_frac: republicanVal,
      dem16_frac: democratVal
    };
    console.log("politics value = ", value);
  }
  return innerCB;
};

Controller.prototype.getPreferencesSliderAffordabilityCB = function() {
  let that = this;
  function innerCB(event) {
    let value = $(this)[0].value;
    that.userPrefs.affordability = value;
    console.log("affordability value = ", value);
  }
  return innerCB;
};

Controller.prototype.createPreferencesTextinputCard = function(prefParams) {
  p = document.createElement("div");

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
  `);
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

Controller.prototype.createResultsBody = function createResultsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  $(bodyDiv).empty();

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
  $(bodyDiv).append(main);
  $(bodyDiv).append(footer);

  nextButton = document.getElementById("navigate_before");
  $(nextButton).on(
    "click",
    this.getNextButtonCB(this.createPreferencesBody.bind(this))
  );

  /* Make hamburger menu responsive to clicks. */
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"));
  componentHandler.upgradeDom();
};

Controller.prototype.createResultsMain = function() {
  let m = document.createElement("main");
  $(m).addClass("mdl-layout__content");
  $(m).append('<div class="grid-content">');
  g = document.createElement("div");
  $(g).addClass("mdl-grid theGrid");
  $(m).append(g);
  this.rankedList = this.cr.cityRank(this.userPrefs);
  this.rankedList.length = 10;
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
      $(g).append(mc);
    }
    let cityParams = this.marshallModelData(rank++, cityData);
    let c = this.createResultsCityCard(cityParams);
    $(g).append(c);
  });

  return m;
};

Controller.prototype.marshallModelData = function(rank, cityData) {
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

Controller.prototype.createResultsCityCard = function(cityParams) {
  p = document.createElement("div");

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
  $(p).addClass("mdl-cell results-cell mdl-cell--3-col");
  $(p).html(`
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
  `);
  return p;
};

Controller.prototype.createResultsMonetizeCard = function(params) {
  p = document.createElement("div");
  $(p).addClass("mdl-cell preference-cell mdl-cell--3-col");
  $(p).html(`
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
  `);
  return p;
};

Controller.prototype.createResultsFooter = function(fabIcon) {
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
          style="visibility: hidden; margin-left: 1.5em; margin-right: 1.5em;"
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
};

Controller.prototype.getNextButtonCB = function(createBodyFn) {
  let that = this;
  function innerFunction() {
    createBodyFn();
  }
  return innerFunction;
};

Controller.prototype.createHamburgerMenu = function() {
  m = document.createElement("div");
  $(m).addClass("mdl-layout__drawer-button");
  $(m).attr("role", "button");
  $(m).attr("aria-expanded", "false");
  $(m).append(`
    <i class="material-icons">menu</i>
  `);
  return m;
};

Controller.prototype.createMenuDrawer = function(title, menuItemsArray) {
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
};

Controller.prototype.createFooter = function(fabIcon) {
  f = document.createElement("footer");
  $(f).addClass("mdl-mini-footer");
  $(f).html(`
    <button id="navigate_next" data-nextpage="preferences" class="footer-fab mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--primary">
      <i class="material-icons">${fabIcon}</i>
    </button>
    <div class="mdl-mini-footer__left-section"><span class="copyright-text">
      <i class="material-icons footer-icons">location_city</i>
      <i class="material-icons footer-icons">favorite</i>
      <span class="copyright-text">City Match &copy; 2019</span>
    </div>
  `);
  return f;
};
