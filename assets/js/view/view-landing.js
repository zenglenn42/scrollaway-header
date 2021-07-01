//----------------------------------------------------------------------------------
// Landing Page
//
// These view methods update the browser DOM to render the initial screen when
// the user starts the app.
//----------------------------------------------------------------------------------
// TODO: Replace hardcoded presentation text with calls to (locale-sensitive) 
//       landing model getter methods.
//
//       This will enable localization support.
//----------------------------------------------------------------------------------

View.prototype.createLandingBody = function() {
  let bodyDiv = document.getElementById(this.bodyDivId)
  bodyDiv.innerHTML = ""

  let appName = this.getAppName()
  let slogan = this.getSlogan()
  let blurb = this.getBlurb()
  let header = this.createHeader(appName, "search")

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
  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainLanding)
  bodyDiv.appendChild(footer)

  // Make hamburger menu responsive to clicks.
  componentHandler.downgradeElements(document.querySelector(".mdl-layout"))
  componentHandler.upgradeDom()

  this.addLandingPageEventListeners()
}


View.prototype.createLandingMain = function(slogan, blurbArray) {
  let m = document.createElement("main")
  m.classList.add("content")
  m.setAttribute("id", "main")
  m.setAttribute("data-currpage", "landing")

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
