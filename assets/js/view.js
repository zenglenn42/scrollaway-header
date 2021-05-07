function View(
  bodyDivId,
  addLandingPageEventListeners,
  addPreferencesPageEventListeners,
  addResultsPageEventListeners,
  cityRankModelCB,
  minHappinessValue,
  midHappinessValue,
  maxHappinessValue,
  minAffordabilityValue,
  midAffordabilityValue,
  maxAffordabilityValue,
  midPoliticsValue,
  githubUrl,
  maxResults
) {
  this.maxResults = maxResults;

  this.bodyDivId = bodyDivId;
  this.rankedList = [];
  this.addLandingPageEventListeners = addLandingPageEventListeners;
  this.addPreferencesPageEventListeners = addPreferencesPageEventListeners;
  this.addResultsPageEventListeners = addResultsPageEventListeners;

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

  this.activeDataView = this.defaultDataView;
  this.resultsMain = undefined;
}

View.prototype.switchHappinessEnabledDefault = true;
View.prototype.switchHappinessId = "switch-happiness";
View.prototype.sliderHappinessId = "slider-happiness";
View.prototype.tooltipHappinessId = "tooltip-happiness";

View.prototype.switchPoliticsEnabledDefault = true;
View.prototype.switchPoliticsId = "switch-political-affiliation";
View.prototype.sliderPoliticsId = "slider-politics";
View.prototype.tooltipPoliticsId = "tooltip-politics";

View.prototype.switchAffordabilityEnabledDefault = true;
View.prototype.switchAffordabilityId = "switch-affordability";
View.prototype.sliderAffordabilityId = "slider-affordability";
View.prototype.tooltipAffordabilityId = "tooltip-affordability";

View.prototype.switchJobSearchEnabledDefault = false;
View.prototype.switchJobSearchId = "switch-jobsearch";
View.prototype.tooltipJobSearchId = "tooltip-jobsearch";

View.prototype.defaultDataView = "photo-view"; // photo-view | list-view | chart-view | map-view

View.prototype.setUserPrefs = function(userPrefs) {
  this.userPrefs = userPrefs;
};

View.prototype.createHeader = function(title, rightNavIcon) {
  let h = document.createElement("header");
  h.classList += "mdl-layout__header";
  h.innerHTML = `
      <div class="mdl-layout__header-row">
      <div class="mdl-layout-spacer"></div>
      <span class="mdl-layout-title mdl-layout-title-nudged">${title}</span>
      <div class="mdl-layout-spacer"></div>
      <nav class="mdl-navigation">
        <!--
          <a class="mdl-navigation__link" href="">
            <i id="header-search" class="material-icons">${rightNavIcon}</i>
          </a>
        -->
          <a id="header-logo__link" class="mdl-navigation__link" href="" title="home" ref="noreferrer noopener">
            <i class='material-icons header-icons'>home</i>
          </a>
      </nav>
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
  let menuDrawer = this.createMenuDrawer()
  let hamburgerMenu = this.createHamburgerMenu();
  let landingText1 =
    "Thinking about a move but not sure which city is your best bet?";
  let landingText2 =
    "Share your values and we'll offer some aligned options to consider.";
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
        <div id="landing-text" class="mdl-card__supporting-text">
          <p>${supportText1}</p>
          <p>${supportText2}</p>
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
  let header = this.createHeader(
        "Share your values ...", "search");
  let menuDrawer = this.createMenuDrawer();
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
    tooltipId: `${this.tooltipHappinessId}`,
    iconClass: "far fa-lg pr-3",
    leftSliderIcon: "fa-meh",
    rightSliderIcon: "fa-smile",
    minSliderVal: this.minHappinessValue,
    maxSliderVal: this.maxHappinessValue,
    curSliderVal: this.userPrefs.happiness,
    sliderEnabled: this.userPrefs.happinessEnabled,
    prefLink: "",
    tooltipText: "Use slider below to adjust this preference.  Based upon a 2019 study by WalletHub across dimensions including overall well-being, employment, and community."
  };
  let c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  let curPoliticsVal = this.userPrefs.politics.rep16_frac;
  prefParams = {
    img: "assets/img/politics-flags.jpg",
    titleText: "Prevailing Politics",
    switchId: `${this.switchPoliticsId}`,
    sliderId: `${this.sliderPoliticsId}`,
    sliderContainerId: `${this.sliderPoliticsId}-container`,
    tooltipId: `${this.tooltipPolitics}`,
    iconClass: "fas fa-lg pr-3",
    leftSliderIcon: "fa-democrat blue-text",
    rightSliderIcon: "fa-republican red-text",
    minSliderVal: "0",
    maxSliderVal: "100",
    curSliderVal: `${curPoliticsVal}`,
    sliderEnabled: this.userPrefs.politicsEnabled,
    prefLink: "",
    tooltipText: "Use slider below to adjust this preference of desired prevailing political environment.  Based upon county-level 2016 Presidential election data published by opendatasoft."
  };
  c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  prefParams = {
    img: "assets/img/affordability-piggybank.jpg",
    titleText: "Cost of Living",
    switchId: `${this.switchAffordabilityId}`,
    sliderId: `${this.sliderAffordabilityId}`,
    sliderContainerId: `${this.sliderAffordabilityId}-container`,
    tooltipId: `${this.tooltipAffordabilityId}`,
    iconClass: "fas fa-md pr-3",
    leftSliderIcon: "fa-dollar-sign",
    rightSliderIcon: "fa-dollar-sign",
    minSliderVal: this.minAffordabilityValue,
    maxSliderVal: this.maxAffordabilityValue,
    curSliderVal: this.userPrefs.affordability,
    sliderEnabled: this.userPrefs.affordabilityEnabled,
    prefLink: "",
    tooltipText: "Use slider below to specify desired relative cost of living.  Based upon 2017 median home price by county published by US Census."
  };
  c = this.createPreferencesSliderCard(prefParams);
  g.appendChild(c);

  prefParams = {
    img: "assets/img/job-search.jpg",
    switchId: `${this.switchJobSearchId}`,
    inputId: "input-jobsearch",
    tooltipId: `${this.tooltipJobSearchId}`,
    titleText: "Job Outlook",
    iconClass: "far fa-lg pr-3",
    icon: "fa-user",
    placeHolderText: "Job Title",
    sliderEnabled: this.userPrefs.jobSearchEnabled,
    prefLink: "",
    tooltipText: "This feature is currently unavailable."
  };
  c = this.createPreferencesTextinputCard(prefParams);
  g.appendChild(c);

  return m;
};

View.prototype.createPreferencesSliderCard = function(prefParams, isEnabled) {
  let p = document.createElement("div");

  if (prefParams.titleText == "Cost of Living") {
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
  let tooltipId = `${prefParams.tooltipId}`
  p.innerHTML = `
      <div class="preference-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${prefParams.img}') top/cover; ${colorFilter}"
        >
          <h2
            id=${tooltipId}
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
          >
            ${prefParams.titleText} &nbsp;
            <i class="material-icons info-icon">info</i>
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
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" data-mdl-for=${tooltipId}>${prefParams.tooltipText}</div>
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
  let tooltipId = `${prefParams.tooltipId}`
  p.innerHTML = `
      <div class="preference-card-square mdl-card mdl-shadow--3dp">
        <div
          class="mdl-card__title mdl-card--expand"
          style="background: url('${prefParams.img}') top/cover; ${colorFilter}"
        >
          <h2
            id=${tooltipId}
            class="mdl-card__title-text"
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
          >
            ${prefParams.titleText} &nbsp;
            <i class="material-icons info-icon">info</i>
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
              placeholder="Job Title (disabled)"
              disabled
            />
          </div>
        </div>
        <div class="mdl-card__menu"></div>
        <div class="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" data-mdl-for=${tooltipId}>${prefParams.tooltipText}</div>
      </div>
    `;
  /* Disable switch since job outlook feature not yet implemented. */
  /*
  let mdlSwitch = this.createSlideSwitch(
    prefParams.switchId,
    prefParams.sliderEnabled
  );
  let cardMenu = p.getElementsByClassName("mdl-card__menu")[0];
  cardMenu.appendChild(mdlSwitch);
  */
  return p;
};

//-----------------------------------//
// Results Page
//-----------------------------------//

View.prototype.createResultsBody = function createResultsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId);
  bodyDiv.innerHTML = "";
  let header = this.createHeader("Consider these ...", "search");
  let menuDrawer = this.createMenuDrawer()
  let hamburgerMenu = this.createHamburgerMenu();
  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu);
  this.resultsMain = this.createResultsMain(bodyDiv);
  // bodyDiv.appendChild(this.resultsMain);
  let footer = this.createResultsFooter("navigate_before");
  bodyDiv.appendChild(footer);
  this.setActiveDataView(this.activeDataView);

  this.addResultsPageEventListeners();
};

View.prototype.createResultsMain = function(bodyDiv) {
  let m = document.createElement("main");
  m.classList.add("mdl-layout__content");
  let child = document.createElement("div");
  let g = document.createElement("div");

  computedUserPrefs = this.getComputedUserPrefs();
  if (this.noUserPreferences(computedUserPrefs)) {
    child.classList.add("grid-content");
    m.appendChild(child);
    let noPrefsParams = {
      img: "assets/img/chess-failure.jpg",
      titleText: "No results available.",
      supportingText: "Please go back and specify one or more preferences."
    };
    let c = this.createResultsNoPrefsCard(noPrefsParams);
    g.classList.add("mdl-grid");
    g.classList.add("theGrid");
    g.appendChild(c);
    m.appendChild(g);
    bodyDiv.appendChild(m);
  } else {
    this.rankedList = this.cityRankModelCB(computedUserPrefs);
    this.rankedList.length = this.maxResults;
    let rank = 1;
    switch (this.activeDataView) {
      case "list-view":
        let ol = this.createListView(computedUserPrefs);
        child.appendChild(ol);
        m.appendChild(child);
        bodyDiv.appendChild(m);
        break;
      case "chart-view":
        let chartId = "myChart";
        child.innerHTML = `
          <canvas id="${chartId}" style="height: 73vh"></canvas>
        `;
        m.appendChild(child);
        bodyDiv.appendChild(m);
        this.createChartView(chartId);
        break;
      case "map-view":
        {
          let mapId = "mapid";
          child.setAttribute("id", mapId);
          child.setAttribute("style", "height: 80vh");
          m.appendChild(child);
          bodyDiv.appendChild(m);
          this.createMapView(mapId);
        }
        break;
      case "photo-view":
      default:
        console.log("photo-view");
        child.classList.add("grid-content");
        m.appendChild(child);
        g.classList.add("mdl-grid");
        g.classList.add("theGrid");
        m.appendChild(g);
        //-----------------------------------//
        // Call the model to get ranked list
        // of cities sorted by user preference.
        //-----------------------------------//
        console.log("computed prefs passed to model =", computedUserPrefs);
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
        bodyDiv.appendChild(m);
        break;
    }
  }
};

View.prototype.createListView = function(computedUserPrefs, rank = 1) {
  console.log("list-view");
  let ol = document.createElement("ol");
  ol.classList.add("mdl-list");
  ol.setAttribute("style", "width: 95%");
  console.log("computed prefs passed to model =", computedUserPrefs);

  // let monetizationPosition1 = 3;
  // let monetizationPosition2 = 8;
  this.rankedList.map(cityData => {
    // if (rank == monetizationPosition1 || rank == monetizationPosition2) {
    //   let monetizeParams = {
    //     img: "assets/img/monetize.jpg",
    //     titleText: "Monetize here $"
    //   };
    //   let mc = this.createResultsMonetizeCard(monetizeParams);
    //   g.appendChild(mc);
    // }
    let cityParams = this.marshallModelData(rank++, cityData);
    let li = this.createResultsListItem(cityParams);
    ol.appendChild(li);
  });
  return ol;
};

View.prototype.createChartView = function(chartId) {
  var ctx = document.getElementById(chartId).getContext("2d");
  let cityLabels = [];
  let happinessData = [];
  let affordabilityData = [];
  let politicsData = [];
  let rankData = [];
  let r = 1;
  console.log(this.rankedList);
  this.rankedList.map(cityData => {
    let cp = this.marshallModelData(r++, cityData);
    cityLabels.push(cp.titleText);
    happinessData.push(cp.hDistance.toFixed(2));
    affordabilityData.push(cp.aDistance.toFixed(2));
    politicsData.push(cp.pDistance.toFixed(2));
    rankData.push(cp.vDistance.toFixed(2));
  });
  var barChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: "Combined",
        backgroundColor: "black",
        stack: "Stack 0",
        data: rankData
      },
      {
        label: "Happiness",
        // backgroundColor: "rgba(255, 99, 132, 0.2)",
        backgroundColor: "gold",
        stack: "Stack 1",
        data: happinessData
      },
      {
        label: "Affordability",
        backgroundColor: "lightseagreen",
        stack: "Stack 1",
        data: affordabilityData
      },
      {
        label: "Politics",
        backgroundColor: "mediumslateblue",
        stack: "Stack 1",
        data: politicsData
      }
    ]
  };
  var myChart = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: {
      title: {
        display: true,
        text: "Distance from User Preference (0 = ideal)"
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    }
  });
};

View.prototype.createMapView = function(mapId) {
  let map = L.map(mapId).setView([38, -96], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  let rank = 0;
  this.rankedList.map(cityData => {
    let cityParams = this.marshallModelData(rank++, cityData);
    let markerText = `${rank}. ${cityParams.titleText}`;
    let lat = cityParams.lat;
    let lng = cityParams.lng;
    if (rank == 1) {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(markerText)
        .openPopup();
    } else {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(markerText);
    }
  });
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
  cityParams.vDistance = cityProperties[0].distance.vector;
  cityParams.hDistance = cityProperties[0].distance.happiness;
  cityParams.aDistance = cityProperties[0].distance.affordability;
  cityParams.pDistance = cityProperties[0].distance.politics;
  cityParams.lat = cityProperties[0].location.lat;
  cityParams.lng = cityProperties[0].location.lng;
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
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
          >
            ${cityParams.rank}. ${cityParams.titleText}
          </h2>
        </div>
        <div class="mdl-card__supporting-text">
          ${cityStats}
        </div>
        <div class="mdl-card__menu">
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" style="background: rgba(255,255,255,.8);">
            <i class="material-icons">favorite_border</i>
          </button>
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" style="background: rgba(255,255,255,.8);">
            <i class="material-icons">more_vert</i>
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
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
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
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" style="background: rgba(255,255,255,.8);">
              <i class="material-icons">more_vert</i>
            </button>
          </div>
        </div>
      </div>
    `;
  return p;
};

View.prototype.createResultsListItem = function(cityParams) {
  let li = document.createElement("li");
  let donkey =
    '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>';
  let elephant =
    '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>';
  let politics = `${donkey}${
    cityParams.politics.demFraction
  }%  &nbsp; ${elephant}${cityParams.politics.repFraction}%`;

  let affordability = this.formatter.format(cityParams.affordability);

  let cityStats = `Civic Happiness:  ${
    cityParams.happiness
  } | Median Home Price: ${affordability} | ${politics}`;

  li.classList.add("mdl-list__item");
  li.classList.add("mdl-list__item--three-line");
  li.classList.add("results-list-item");
  li.innerHTML = `
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">location_city</i>
        <span>${cityParams.rank}. ${cityParams.titleText}</span>
        <span class="mdl-list__item-text-body">
          ${cityStats}
        </span>
      </span>
      <span class="mdl-list__item-secondary-content">
        <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">more_horiz</i></a>
      </span>`;
  return li;
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
            style="padding: 0 0.2em; border-radius: 0.1em; background-color: rgba(6,6,6,0.6)"
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
        <div class="mdl-tabs__tab-bar view-button-tab-bar">
          <a id="photo-view" href="#photo-button" class="mdl-tabs__tab view-link is-active">
            <div id="photo-button" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
              <i class="material-icons view-icons">photo</i>
            </div>
          </a>
          <a id="list-view" href="#list-button" class="mdl-tabs__tab view-link">
            <div id="list-button" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
              <i class="material-icons view-icons">list</i>
            </div>
          </a>
          <a id="hidden-view" href="#hidden-button" class="mdl-tabs__tab view-link" style="visibility: hidden">
            <div
            role="button"
            aria-expanded="false"
            style="visibility: hidden; margin-left: 1.5em; margin-right: 1.5em;"
          >
              <i class="material-icons view-icons">place</i>
            </div>
          </a>
          <a id="chart-view" href="#chart-button" class="mdl-tabs__tab view-link">
            <div id="chart-button" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
              <i class="material-icons view-icons">insert_chart</i>
            </div>
          </a>
          <a id="map-view" href="#map-button" class="mdl-tabs__tab view-link">
            <div id="map-button" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
              <i class="material-icons view-icons">map</i>
            </div>
          </a>
        </div>
      </div>
    `;
  return f;
};

View.prototype.findActiveDataView = function() {
  let views = ["photo-view", "list-view", "chart-view", "map-view"];
  for (view of views) {
    if (this.isActiveDataView(view)) return view;
  }
};

View.prototype.isActiveDataView = function(viewId) {
  let av = document.getElementById(viewId);
  return av.classList.contains("is-active");
};

View.prototype.setActiveDataView = function(viewId) {
  let activeViewId = this.findActiveDataView();
  if (activeViewId != viewId) {
    let av = document.getElementById(activeViewId);
    av.classList.remove("is-active");
    let newView = document.getElementById(viewId);
    newView.classList.add("is-active");
    this.activeDataView = viewId;
  }
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

View.prototype.createMenuDrawer = function(title="Menu", menuItemsArray=[]) {

  let md = document.createElement("span");
  md.classList.add("mdl-layout__drawer");
  let mdChild = document.createElement("div");
  mdChild.classList.add("mdl-layout-title");
  mdChild.classList.add("mdl-menu__item--full-bleed-divider");
  mdChild.innerHTML = title;
  md.appendChild(mdChild);

  /*
  let nav = document.createElement("nav");
  nav.classList.add("mdl-navigation");
  let invariantMenuHtml = invariantMenuItems.map(item => {
    let anchor = document.createElement("a");
    anchor.classList.add("mdl-navigation__link");
    anchor.setAttribute("href", "");
    anchor.innerHTML = `${item}`;
    return anchor;
  });
  invariantMenuHtml.map(html => {
    md.appendChild(html);
  });
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
  */

  // TODO: DRY this up with a map lambda.

  let gotoMenuButton = "button"
  let gotoMenuButtonNode = document.createElement(gotoMenuButton)
  gotoMenuButtonNode.setAttribute("id", "gotoMenu");
  gotoMenuButtonNode.setAttribute("style", "text-align:left");
  gotoMenuButtonNode.classList.add("mdl-button");
  gotoMenuButtonNode.classList.add("mdl-js-button");
  gotoMenuButtonNode.innerHTML = "<i class='material-icons header-icons'>visibility</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>View ...</span>"
  md.appendChild(gotoMenuButtonNode);
  let gotoMenuHtml = "ul"
  let gotoMenuNode = document.createElement(gotoMenuHtml);
  gotoMenuNode.classList.add("mdl-menu");
  gotoMenuNode.classList.add("mdl-js-menu");
  gotoMenuNode.classList.add("mdl-menu--bottom-right");
  gotoMenuNode.setAttribute("for", "gotoMenu");
  gotoMenuNode.innerHTML  = "<li class='mdl-menu__item'><a href='' ref='noreferrer noopener' title='home'><i class='material-icons header-icons'>home</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>1. Introduction</span></a></li>",
  gotoMenuNode.innerHTML += "<li class='mdl-menu__item' disabled><i class='material-icons header-icons'>tune</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>2. Your values</span></li>"
  gotoMenuNode.innerHTML += "<li class='mdl-menu__item mdl-menu__item--full-bleed-divider' disabled><i class='material-icons header-icons'>location_city</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>3. Cities to consider</span></li>"
  gotoMenuNode.innerHTML += "<li class='mdl-menu__item'><a href='" + this.githubUrl + "' target='_blank' ref='noreferrer noopener' title='blog'><i class='material-icons header-icons'>local_library</i>&nbsp;&nbsp;<span class='mdl-menu__itemtext-nudged'>Blog</span></a></li>",
  md.appendChild(gotoMenuNode);

  let settingsMenuButton = "button"
  let settingsMenuButtonNode = document.createElement(settingsMenuButton)
  settingsMenuButtonNode.setAttribute("id", "settingsMenu");
  settingsMenuButtonNode.setAttribute("style", "text-align:left");
  settingsMenuButtonNode.classList.add("mdl-button");
  settingsMenuButtonNode.classList.add("mdl-js-button");
  settingsMenuButtonNode.innerHTML = "<i class='material-icons header-icons'>settings</i>&nbsp;&nbsp;<span class='mdl-layout-title-nudged'>Settings ...</span>"
  md.appendChild(settingsMenuButtonNode);
  let settingsMenuHtml = "ul"
  let settingsMenuNode = document.createElement(settingsMenuHtml);
  settingsMenuNode.classList.add("mdl-menu");
  settingsMenuNode.classList.add("mdl-js-menu");
  settingsMenuNode.classList.add("mdl-menu--bottom-right");
  settingsMenuNode.setAttribute("for", "settingsMenu");
  let maxResultsString = "Show top " + this.maxResults + " cities"
  settingsMenuNode.innerHTML  = "<li class='mdl-menu__item' disabled><span style='position:relative; top: -10%'>" + maxResultsString + "</span></li>"
  settingsMenuNode.innerHTML += "<li class='mdl-menu__item' disabled><span style='position:relative; top: -10%'>" + "Reset to default values" + "</span></li>"
  md.appendChild(settingsMenuNode);

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
        <i class="material-icons footer-icons" style="position:relative; left:-0.5em">favorite</i>
        <span class="copyright-text" style="position:relative; left:-1.5em">City Match &copy; 2019</span>
      </div>
      <div class="mdl-mini-footer__right-section">
        <a href="${this.githubUrl}" target="_blank" title="github" ref="noreferrer noopener">
          <button id="button-octocat" data-nextpage="preferences" class="mdl-button mdl-js-button mdl-js-ripple-effect">
            <i id="footer-icon-octocat" class="fab fa-github-square" aria-hidden="true"></i>
          </button>
        </a>
      </div>
    `;
  return f;
};
