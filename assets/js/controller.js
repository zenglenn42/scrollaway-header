function Controller(bodyDivId) {
  let bodyDiv = document.getElementById(bodyDivId);
  let header = createHeader("CityMatch", "search");

  bodyDiv.append(header);
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
