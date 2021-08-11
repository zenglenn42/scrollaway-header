//----------------------------------------------------------------------------------
// Landing Page
//
// These view methods update the browser DOM to render the initial screen when
// the user starts the app (in the absence of persisted state).
//----------------------------------------------------------------------------------

View.prototype.createLandingBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  this.removeChildNodes(bodyDiv)

  let title = this.getAppName()
  let header = this.createHeader(title)
  let menuDrawer = this.createMenuDrawer()
  let main = this.createLandingMain(this.getSlogan(), this.getBlurb().split("\n"))
  let footer = this.createFooter()

  bodyDiv.appendChild(header)
  bodyDiv.appendChild(menuDrawer)
  bodyDiv.appendChild(main)
  bodyDiv.appendChild(footer)

  this.addMenuDrawerEventListeners()
  this.addHeaderEventListeners()
  this.addLandingPageEventListeners()
  getmdlSelect.init('.getmdl-select') // Event listeners for 3rd-party dropdown elements.
}


View.prototype.createLandingMain = function(slogan, blurbArray) {
  let m = document.createElement("main")
  m.classList.add("content")
  m.setAttribute("id", "main")

  // Present each blurb array text element as a separate html
  // paragraph for better whitespace control.

  let blurbParagraphs = blurbArray.reduce((acc, blurbItem) => {
      acc += `<p>${blurbItem}</p>`
      return acc
    }, "")

  m.innerHTML = `
      <div class="landing-card-wide mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title">
          <h2 class="mdl-card__title-text">${slogan}</h2>
        </div>
        <div id="landing-text" class="mdl-card__supporting-text">
          ${blurbParagraphs}
        </div>
      </div>    
    `
  return m
}
