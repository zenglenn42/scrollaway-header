//----------------------------------------------------------------------------------
// Results Page
//
// These view methods update the browser DOM to render the results screen.
//----------------------------------------------------------------------------------
// TODO: Replace inline styles with class-based css styles.
//
// TODO: Prevent map-view if internet is not available since leaflet is inet dep.
//----------------------------------------------------------------------------------

View.prototype.createResultsBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  this.removeChildNodes(bodyDiv)

  let title = this.getAppName()
  let subTitle = this.getResultsSubtitle()

  // TODO: Add ability to make the subTitle disappear in *.createHeader()
  //       especially on mobile when swiping up to view content below.
  //       Screen real estate is too previous on small devices to give
  //       preference to a fixed header instead of city results, for example.

  let header = this.createHeader(title, subTitle)
  let menuDrawer = this.createMenuDrawer()
  let main = this.createResultsMain()
  let footer = this.createResultsFooter()

  bodyDiv.appendChild(header)
  bodyDiv.appendChild(menuDrawer)
  bodyDiv.appendChild(main)
  this.appendLatentView(main)
  bodyDiv.appendChild(footer)

  // Update presentation of results based upon data-view in model.
  // TODO: We really should be persisting this state between sessions.
  this.setActiveDataView(this.getActiveDataView())

  this.addMenuDrawerEventListeners()
  this.addHeaderEventListeners()
  this.addResultsPageEventListeners()
  getmdlSelect.init('.getmdl-select') // Event listeners for 3rd-party dropdown elements.
}

View.prototype.getResultsSubtitle = function() {
  let subTitle  = `<i class="fas fa-trophy"></i>&nbsp;&nbsp; ${this.getResultsTitle()}`
  return subTitle
}

// Some advanced views require the main div to already be
// connected to the DOM before we can build-out the view.

View.prototype.appendLatentView = function(mainEl) {
  let view = mainEl.getAttribute("data-view")
  let result = false
  switch(view) {
    case "chart":
      this.createChartView()
      break
    case "map": 
      let mapAppended = this.createMapView()
      if (!mapAppended) {
        console.log('[Info] View.appendLatentView(). Map failed.  Leaflet missing due to offline status on reload.')
      }
      result = mapAppended
      break
    case "photo":
    case "list":
    case "table":
    default:
      break
  }
  return result
}

View.prototype.createResultsMain = function() {
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
    m.setAttribute("data-view", "fail")
  } else {
    this.rankedList = this.cityRankModelCB(userPriorities)
    this.rankedList.length = this.getMaxResults()
    let rank = 1
    switch (this.getActiveDataView()) {
      case "list-view":
        let ol = this.createListView(userPriorities)
        child.appendChild(ol)
        m.appendChild(child)
        m.setAttribute("data-view", "list")
        break
      case "table-view":
        child.setAttribute("style", "overflow: scroll")
        let table = this.createTableView(userPriorities)
        table.setAttribute("style", "margin: 2em auto;")
        child.appendChild(table)
        m.appendChild(child)
        m.setAttribute("data-view", "table")
        break
      case "chart-view":
        let chartId = "myChart"
        child.innerHTML = `
          <canvas id="${chartId}" style="height: 73vh"></canvas>
        `
        m.appendChild(child)
        m.setAttribute("data-view", "chart")
        break
      case "map-view":
        {
          let mapId = "mapid"
          child.setAttribute("id", mapId)
          child.setAttribute("style", "height: 80vh")
          m.appendChild(child)
          m.setAttribute("data-view", "map")
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
        m.setAttribute("data-view", "photo")
        break
    }
  }
  return m
}

View.prototype.createListView = function(userPriorities, rank = 1) {
  //console.log("list-view")
  let ol = document.createElement("ol")
  ol.classList.add("mdl-list")
  ol.setAttribute("style", "width: 95%")
  //console.log("normalized user priorities passed to model =", userPriorities)

  this.rankedList.map(cityData => {
    let cityParams = this.marshallModelData(rank++, cityData)
    let li = this.createResultsListItem(cityParams)
    ol.appendChild(li)
  })
  return ol
}

View.prototype.createTableView = function(userPriorities, rank = 1) {
  //console.log("table-view")
  let table = document.createElement("table")
  table.classList.add("mdl-data-table",
                      "mdl-js-data-table",
                      /*"mdl-data-table--selectable",*/
                      "mdl-shadow--2dp")
  table.setAttribute("style", "width: 95%")
  let thead = document.createElement("thead")
  let house = '<i class="fas fa-home fa-sm black-text pr-3" aria-hidden="true"></i>'

  thead.innerHTML = `
    <tr>
      <th class="mdl-data-table__cell--non-numeric">${this.getTableLabelRank()}</th>
      <th class="" style="text-align: left;">${this.getTableLabelCity()}</th>
      <th class="" style="text-align: center;">${this.getTableLabelHappiness()}</th>
      <th class="" style="text-align: center;">${this.getTableLabelPolitics()}</th>
      <th class="" style="text-align: center;">${house} ${this.getTableLabelAffordability()}</th>
    </tr>
  `

  let tbody = document.createElement("tbody")
  this.rankedList.map(cityData => {
    let cityParams = this.marshallModelData(rank++, cityData)
    let tr = this.createResultsTableRow(cityParams)
    tbody.appendChild(tr)
  })

  table.appendChild(thead)
  table.appendChild(tbody)
  return table
}

View.prototype.createChartView = function(chartId = "myChart") {
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

View.prototype.createMapView = function(mapId = "mapid") {
  if (typeof L === 'undefined') {
    return false  // leaflet undefined; inet down on reload most likely
  }
  else {
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
    return true
  }
}

View.prototype.marshallModelData = function(rank, cityData) {
  let cityParams = {}
  let cityProperties = Object.values(cityData)
  // console.log(cityProperties[0].img["imgSrc"])
  let cityName = Object.keys(cityData)[0]
  cityParams.rank = rank
  if (cityProperties[0].img && this.getOnlineStatus() === true) {
    cityParams.img = cityProperties[0].img["imgSrc"]
  } else {
    cityParams.img = this.getMissingCityImg()
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
      emojiIcon = 'fa-meh-rolling-eyes'  // 8| 
      break
    case 2:
      emojiIcon = 'fa-meh'         // :|
      break
    case 3:
      emojiIcon = 'fa-smile'       // :)
      break
    case 4:
      emojiIcon = 'fa-grin-beam'   // :D
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

View.prototype.createResultsTableRow = function(cityParams) {
  let happiness = this.getResultsFormattedHappiness(cityParams.happiness)
  let donkey =
    '<i class="fas fa-democrat fa-sm blue-text pr-3" aria-hidden="true"></i>'
  let elephant =
    '<i class="fas fa-republican fa-sm red-text pr-3" aria-hidden="true"></i>'
  let politics = 
    `${donkey} ${cityParams.politics.demFraction}%  &nbsp; ${elephant} ${cityParams.politics.repFraction}%`
  let affordability = this.formatter.format(cityParams.affordability)

  let tr = document.createElement("tr")
  tr.innerHTML = `
    <td>${cityParams.rank}</td>
    <td class="mdl-data-table__cell--non-numeric">${cityParams.titleText}</td>
    <td class="mdl-data-table__cell--non-numeric">${happiness}</td>
    <td class="mdl-data-table__cell--non-numeric">${politics}</td>
    <td>${affordability}</td>
  `
  return tr
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

View.prototype.getMapViewLinkHtml = function(offline, isActive = "") {
  let mapTooltipHtml = ""
  let disableAttr = ""
  let linkId = "map-view"

  if (offline) {
    linkId += "-disabled"
    disableAttr = "disabled"
    mapTooltip = this.getNoMapView()
    mapTooltipHtml = `
        <div style="text-transform: none;"
              class="mdl-tooltip mdl-tooltip--medium mdl-tooltip--top" 
              data-mdl-for="map-button">
          ${mapTooltip}
        </div>`
  }

  let html = `
        <a id="${linkId}" href="#map-button" class="mdl-tabs__tab view-link" ${isActive}>
          <div ${disableAttr} id="map-button" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
            <i class="material-icons view-icons">map</i>
          </div>
          ${mapTooltipHtml}
        </a>`

  return html
}

View.prototype.getViewLinkHtml = function(linkProps) {
  let html =`
      <a id="${linkProps.id}" href="${linkProps.href}" class="mdl-tabs__tab view-link ${linkProps.isActive}">
        <div id="${linkProps.buttonId}" class="view-button mdl-button mdl-js-button" role="button" aria-expanded="false">
          <i class="material-icons view-icons">${linkProps.icon}</i>
        </div>
      </a>`
  return html
}

View.prototype.getSpacerViewLinkHtml = function() {
  let html =`
      <a id="hidden-view" href="#hidden-button" class="mdl-tabs__tab view-link" style="visibility: hidden">
        <div
        role="button"
        aria-expanded="false"
        style="visibility: hidden; margin-left: 1.5em; margin-right: 1.5em;"
      >
          <i class="material-icons view-icons">place</i>
        </div>
      </a>
  `
  return html
}

View.prototype.createResultsFooter = function() {
  let fab = this.createFAB()

  let offline = (this.getOnlineStatus() !== true)
  let photoLinkHtml = this.getViewLinkHtml({id: "photo-view", href: "#photo-button", buttonId: "photo-button", icon: "photo", isActive: "is-active"})
  let tableLinkHtml = this.getViewLinkHtml({id: "table-view", href: "#table-button", buttonId: "table-button", icon: "table_view", isActive: ""})
  let spacingLinkHtml = this.getSpacerViewLinkHtml()
  let chartLinkHtml = this.getViewLinkHtml({id: "chart-view", href: "#chart-button", buttonId: "chart-button", icon: "insert_chart", isActive: ""})
  let mapLinkHtml = this.getMapViewLinkHtml(offline)

  // List view is kinda lame at the moment so I'm replacing it with table view.
  // I'd leave it in if spacing for an odd number of bottom-appbar icons was more
  // pleasing and resilient.
  // let listLinkHtml = this.getViewLinkHtml({id: "list-view", href: "#list-button", buttonId: "list-button", icon: "list", isActive: ""})

  let f = document.createElement("footer")
  f.classList.add("mdl-mini-foote")
  f.innerHTML = `
      ${fab}
      <div class="view-buttons mdl-tabs mdl-js-tabs">
        <div class="mdl-tabs__tab-bar view-button-tab-bar">
          ${photoLinkHtml}
          ${tableLinkHtml}
          ${spacingLinkHtml}
          ${chartLinkHtml}
          ${mapLinkHtml}
        </div>
      </div>
    `
  return f
}

View.prototype.findCurrentDataView = function() {
  // TODO: reconcile with ModelResults enumerated types.
  //       This array really should be pulled from the view mode.
  let views = ["photo-view", "list-view", "table-view", "chart-view", "map-view"]
  for (view of views) {
    if (this.isActiveDataView(view)) return view
  }
}

View.prototype.isActiveDataView = function(viewId) {
  let av = document.getElementById(viewId)
  return (av) ? av.classList.contains("is-active") : false
}

View.prototype.setActiveDataView = function(nextViewId) {
  let clickedView = this.getActiveDataView()

  let currentViewId = this.findCurrentDataView()
  if (currentViewId != nextViewId) {
    let av = document.getElementById(currentViewId)
    if (av) {
      av.classList.remove("is-active")
      let activeViewId = document.getElementById(nextViewId)
      if (activeViewId) {
        activeViewId.classList.add("is-active")
      } else {
        console.log('[Info] View.setActiveDataView() View id missing or invalid:', nextViewId)
        // TODO: Do something resilient.
      }
    } else {
      console.log('[Info] View.setActiveDataView(). No DOM element with view id:', currentViewId)
      console.log('[Info] View.setActiveDataView(). Ignoring request.')
    }
  }
}
