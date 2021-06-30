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

  let header = this.createHeader("City Match", "search")
  let menuDrawer = this.createMenuDrawer()
  this.addMenuDrawerEventListeners()

  let hamburgerMenu = this.createHamburgerMenu()
  let landingText1 =
    "Thinking about a move but not sure which city is your best bet?"
  let landingText2 =
    "Share your priorities and we'll offer some options to consider."
  let mainLanding = this.createLandingMain(
    "Find your city",
    landingText1,
    landingText2
  )
  let footer = this.createFooter()
  this.makeNav(bodyDiv, header, menuDrawer, hamburgerMenu)
  bodyDiv.appendChild(mainLanding)
  bodyDiv.appendChild(footer)
  this.addLandingPageEventListeners()
}

View.prototype.createLandingMain = function(
  titleText,
  supportText1,
  supportText2
) {
  let m = document.createElement("main")
  m.classList.add("content")
  m.setAttribute("id", "main")
  m.setAttribute("data-currpage", "landing")
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
    `
  return m
}
