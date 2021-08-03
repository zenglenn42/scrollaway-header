//----------------------------------------------------------------------------------
// Landing Page
//
// These view methods update the browser DOM to render the initial screen when
// the user starts the app.
//----------------------------------------------------------------------------------

View.prototype.createLandingBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  this.removeChildNodes(bodyDiv)

  let appName = this.getAppName()
  let slogan = this.getSlogan()
  let blurb = this.getBlurb()
  let header = this.createHeader(appName, [])

  // Split newline-delimited sentences from blurb text into
  // separate array entries for more latitude with html formatting.
  let delimitedBlurb = blurb.split("\n")

  let menuDrawer = this.createMenuDrawer()
  this.addMenuDrawerEventListeners()

  let hamburgerMenu = this.createHamburgerMenu()
  let mainLanding = this.createLandingMain(
    slogan,
    delimitedBlurb
  )
  let footer = this.createFooter()
  this.addHeader(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainLanding)
  bodyDiv.appendChild(footer)

  this.addLandingPageEventListeners()
}


View.prototype.createLandingMain = function(slogan, blurbArray) {
  let m = document.createElement("main")
  m.classList.add("content")
  m.setAttribute("id", "main")

  // Present each blurb array text element as a separate html paragraph.
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
