//----------------------------------------------------------------------------------
// Results Page
//
// These view methods update the browser DOM to render the results screen.
//----------------------------------------------------------------------------------
// TODO: Replace inline styles with class-based css styles.
//
// TODO: Prevent map-view if internet is not available since leaflet is inet dep.
//----------------------------------------------------------------------------------

View.prototype.createResultsBody = function createResultsBody() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  this.removeChildNodes(bodyDiv)
  let header = this.createHeader(this.getResultsTitle(), "search")
  let menuDrawer = this.createMenuDrawer()
  this.addMenuDrawerEventListeners()
  let hamburgerMenu = this.createHamburgerMenu()
  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu)
  this.resultsMain = this.createResultsMain(bodyDiv)
  let footer = this.createResultsFooter()
  bodyDiv.appendChild(footer)

  // Update presentation of results based upon data-view in model.
  // TODO: We really should be persisting this state between sessions.
  this.setActiveDataView(this.getActiveDataView())

  this.addResultsPageEventListeners()
}

View.prototype.createResultsMain = function(bodyDiv) {
  let m = document.createElement("main")
  m.setAttribute("id", "main")
  m.classList.add("mdl-layout__content")
  let child = document.createElement("div")
  let g = document.createElement("div")

  userPriorities = this.getNormalizedPriorities()
  if (this.hasNoPriorities(userPriorities)) {
    child.classList.add("grid-content")
    m.appendChild(child)
    let noPrioritiesParams = {
      img: this.getNoResultsImg(),
      titleText: this.getNoResults(),
      supportingText: this.getNoResultsAdvice()
    }
    let c = this.createResultsNoPrioritiesCard(noPrioritiesParams)
    g.classList.add("mdl-grid")
    g.appendChild(c)
    m.appendChild(g)
    bodyDiv.appendChild(m)
  } else {
    this.rankedList = this.cityRankModelCB(userPriorities)
    this.rankedList.length = this.getMaxResults()
    let rank = 1
    switch (this.getActiveDataView()) {
      case "list-view":
        let ol = this.createListView(userPriorities)
        child.appendChild(ol)
        m.appendChild(child)
        bodyDiv.appendChild(m)
        break
      case "chart-view":
        let chartId = "myChart"
        child.innerHTML = `
          <canvas id="${chartId}" style="height: 73vh"></canvas>
        `
        m.appendChild(child)
        bodyDiv.appendChild(m)
        this.createChartView(chartId)
        break
      case "map-view":
        {
          let mapId = "mapid"
          child.setAttribute("id", mapId)
          child.setAttribute("style", "height: 80vh")
          m.appendChild(child)
          bodyDiv.appendChild(m)
          this.createMapView(mapId)
        }
        break
      case "photo-view":
      default:
        //console.log("photo-view")
        child.classList.add("grid-content")
        m.appendChild(child)
        g.classList.add("mdl-grid")
        m.appendChild(g)
        //-----------------------------------//
        // Call the model to get ranked list
        // of cities sorted by user priority.
        //-----------------------------------//
        //console.log("normalized user priorities passed to model =", userPriorities)
        let monetizationPosition1 = 3
        let monetizationPosition2 = 8
        this.rankedList.map(cityData => {
          if (rank == monetizationPosition1 || rank == monetizationPosition2) {
            let monetizeParams = {
              img: this.getMonetizeImg(),
              titleText: this.getMonetizeHere()
            }
            let mc = this.createResultsMonetizeCard(monetizeParams)
            g.appendChild(mc)
          }
          let cityParams = this.marshallModelData(rank++, cityData)
          let c = this.createResultsCityCard(cityParams)
          g.appendChild(c)
        })
        bodyDiv.appendChild(m)
        break
    }
  }
}

View.prototype.createListView = function(userPriorities, rank = 1) {
  //console.log("list-view")
  let ol = document.createElement("ol")
  ol.classList.add("mdl-list")
  ol.setAttribute("style", "width: 95%")
  //console.log("normalized user priorities passed to model =", userPriorities)

  // let monetizationPosition1 = 3
  // let monetizationPosition2 = 8
  this.rankedList.map(cityData => {
    // if (rank == monetizationPosition1 || rank == monetizationPosition2) {
    //   let monetizeParams = {
    //     img: "assets/img/monetize.jpg",
    //     titleText: "Monetize here $"
    //   }
    //   let mc = this.createResultsMonetizeCard(monetizeParams)
    //   g.appendChild(mc)
    // }
    let cityParams = this.marshallModelData(rank++, cityData)
    let li = this.createResultsListItem(cityParams)
    ol.appendChild(li)
  })
  return ol
}

View.prototype.createChartView = function(chartId) {
  var ctx = document.getElementById(chartId).getContext("2d")
  let cityLabels = []
  let happinessData = []
  let affordabilityData = []
  let politicsData = []
  let rankData = []
  let r = 1
  //console.log(this.rankedList)
  this.rankedList.map(cityData => {
    let cp = this.marshallModelData(r++, cityData)
    cityLabels.push(cp.titleText)
    happinessData.push(cp.hDistance.toFixed(2))
    affordabilityData.push(cp.aDistance.toFixed(2))
    politicsData.push(cp.pDistance.toFixed(2))
    rankData.push(cp.vDistance.toFixed(2))
  })
  var barChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: this.getChartLabelCombined(),
        backgroundColor: "black",
        stack: "Stack 0",
        data: rankData
      },
      {
        label: this.getChartLabelHappiness(),
        // backgroundColor: "rgba(255, 99, 132, 0.2)",
        backgroundColor: "gold",
        stack: "Stack 1",
        data: happinessData
      },
      {
        label: this.getChartLabelAffordability(),
        backgroundColor: "lightseagreen",
        stack: "Stack 1",
        data: affordabilityData
      },
      {
        label: this.getChartLabelPolitics(),
        backgroundColor: "mediumslateblue",
        stack: "Stack 1",
        data: politicsData
      }
    ]
  }
  var myChart = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: {
      title: {
        display: true,
        text: this.getChartTitle()
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
  })
}

View.prototype.createMapView = function(mapId) {
  let map = L.map(mapId).setView([38, -96], 3)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map)
  let rank = 0
  this.rankedList.map(cityData => {
    let cityParams = this.marshallModelData(rank++, cityData)
    let markerText = `${rank}. ${cityParams.titleText}`
    let lat = cityParams.lat
    let lng = cityParams.lng
    if (rank == 1) {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(markerText)
        .openPopup()
    } else {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(markerText)
    }
  })
}

View.prototype.marshallModelData = function(rank, cityData) {
  let cityParams = {}
  let cityProperties = Object.values(cityData)
  // console.log(cityProperties[0].img["imgSrc"])
  let cityName = Object.keys(cityData)[0]
  cityParams.rank = rank
  if (cityProperties[0].img) {
    cityParams.img = cityProperties[0].img["imgSrc"]
  } else {
    cityParams.img = "https://placehold.it/300x150"
  }
  cityParams.titleText = cityName.replace(/['"]+/g, "")
  cityParams.happiness = cityProperties[0].happiness
  cityParams.affordability = cityProperties[0].affordability
  cityParams.politics = {
    demFraction: cityProperties[0].politics.dem16_frac.toFixed(0),
    repFraction: cityProperties[0].politics.rep16_frac.toFixed(0)
  }
  cityParams.vDistance = cityProperties[0].distance.vector
  cityParams.hDistance = cityProperties[0].distance.happiness
  cityParams.aDistance = cityProperties[0].distance.affordability
  cityParams.pDistance = cityProperties[0].distance.politics
  cityParams.lat = cityProperties[0].location.lat
  cityParams.lng = cityProperties[0].location.lng
  cityParams.jobOutlook = 42
  return cityParams
}

// Alias happiness index to emoji based (roughly) on quartile.
//
// TODO: DRY this code up.  Very similar to getMenuPrioritiesFormattedHappiness()

View.prototype.getResultsFormattedHappiness = function(happinessValue) {
  let quartile = this.getSketchyQuartile("happiness", happinessValue)
  let emojiIcon = ''
  switch (quartile) {
    case 1:
      emojiIcon = 'fa-meh'        // :|
      break
    case 2:
      emojiIcon = 'fa-smile'      // :)
      break
    case 3:
      emojiIcon = 'fa-grin'       // :D
      break
    case 4:
      emojiIcon = 'fa-grin-beam'  // `:D
      break
    default:
      emojiIcon = 'fa-meh-blank'
  }
  let emoji = `<i class="far ${emojiIcon} black-text fa-lg pr-3" aria-hidden="true"></i>`
  let happinessFormattedString = `&nbsp;${emoji}&nbsp;${happinessValue}`
  return happinessFormattedString
}

View.prototype.createResultsCityCard = function(cityParams) {
  let p = document.createElement("div")

  let happinessString = this.getResultsFormattedHappiness(cityParams.happiness)
  let donkey =
    '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>'
  let elephant =
    '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>'
  let politics = `${donkey}&nbsp;${cityParams.politics.demFraction}%&nbsp;&nbsp; ${elephant}&nbsp;${cityParams.politics.repFraction}%`
  let affordability = this.formatter.format(cityParams.affordability)
  let cityStats = `<p>${this.getPhotoLabelHappiness()}:  ${happinessString}</br> ${this.getPhotoLabelAffordability()}: ${affordability}</br> ${politics}</p>`

  p.classList.add("mdl-cell")
  p.classList.add("results-cell")
  p.classList.add("mdl-cell--3-col")
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
    `
  return p
}

View.prototype.createResultsMonetizeCard = function(params) {
  let p = document.createElement("div")
  p.classList.add("mdl-cell")
  p.classList.add("priority-cell")
  p.classList.add("mdl-cell--3-col")
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
              ${this.getMonetizeLearnMore()}
            </a>
          </div>
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" style="background: rgba(255,255,255,.8);">
              <i class="material-icons">more_vert</i>
            </button>
          </div>
        </div>
      </div>
    `
  return p
}

View.prototype.createResultsListItem = function(cityParams) {
  let happinessString = this.getResultsFormattedHappiness(cityParams.happiness)

  let li = document.createElement("li")
  let donkey =
    '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>'
  let elephant =
    '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>'
  let politics = `${donkey} ${
    cityParams.politics.demFraction
  }%  &nbsp; ${elephant} ${cityParams.politics.repFraction}%`

  let affordability = this.formatter.format(cityParams.affordability)

  let cityStats = `${this.getListLabelHappiness()}:  ${happinessString} | ${this.getListLabelAffordability()}: ${affordability} | ${politics}`

  li.classList.add("mdl-list__item")
  li.classList.add("mdl-list__item--three-line")
  li.classList.add("results-list-item")
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
      </span>`
  return li
}

View.prototype.createResultsNoPrioritiesCard = function(params) {
  let p = document.createElement("div")
  p.classList.add("mdl-cell")
  p.classList.add("priority-cell")
  p.classList.add("mdl-cell--3-col")
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
    `
  return p
}

View.prototype.createResultsFooter = function() {
  let fab = this.createFAB()

  let f = document.createElement("footer")
  f.classList.add("mdl-mini-foote")
  f.innerHTML = `
      ${fab}
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
    `
  return f
}

View.prototype.findCurrentDataView = function() {
  // TODO: reconcile with ModelResults enumerated types.
  let views = ["photo-view", "list-view", "chart-view", "map-view"]
  for (view of views) {
    if (this.isActiveDataView(view)) return view
  }
}

View.prototype.isActiveDataView = function(viewId) {
  let av = document.getElementById(viewId)
  return av.classList.contains("is-active")
}

View.prototype.setActiveDataView = function(nextViewId) {
  let clickedView = this.getActiveDataView()

  let currentViewId = this.findCurrentDataView()
  if (currentViewId != nextViewId) {
    let av = document.getElementById(currentViewId)
    av.classList.remove("is-active")
    let activeViewId = document.getElementById(nextViewId)
    activeViewId.classList.add("is-active")
  }
}
