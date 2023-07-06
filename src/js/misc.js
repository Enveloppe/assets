/**
 * @file Misc
 * @description Various file links and patch I was to lazy to do in mkdocs
 */

//patch a href attributes
const header_links = document.querySelectorAll('a[href*="#"]');
if (header_links) {
  for (var i = 0; i < header_links.length; i++) {
    const header = header_links[i].getAttribute("href").replace("^.*#", "");
    //replace " " with "-"
    let header_fix = header.replace(/\s/g, "-");
    //replace any accent with the corresponding letter
    header_fix = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    header_links[i].setAttribute(
      "href",
      header_links[i].getAttribute("href").replace(header, header_fix)
    );
  }
}

function getHeightWidth(alt) {
  const heightXwidthReg = new RegExp("\\d+x\\d+");
  const widthReg = new RegExp("\\d+");
  if (alt.match(heightXwidthReg)) {
    var width = parseInt(alt.split("x")[0]);
    var height = parseInt(alt.split("x")[1]);
    return [width, height];
  } else if (alt.match(widthReg)) {
    var width = parseInt(alt.match(widthReg)[0]);
    return [width, 0];
  } else {
    return [0, 0];
  }
}

var p_img = /\.+\\/gi;
var img = document.querySelectorAll("img");
for (var i = 0; i < img.length; i++) {
  var regAlt = new RegExp("\\|");
  if (img[i].alt.match(regAlt)) {
    const alt = img[i].alt.split("|");
    for (var part of alt) {
      if (part.match(new RegExp("\\d+", "g"))) {
        var size = getHeightWidth(part);
        img[i].width = size[0] > 0 ? size[0] : img[i].width;
        img[i].height = size[1] > 0 ? size[1] : img[i].height;
        var partReg = new RegExp(`\\${part}`);
        img[i].alt = img[i].alt.replace(partReg, "");
      }
    }
  }
}

//remove ^id from contents ; 
// Only work in the form of "content ^id" (and ^id must end the lines)
const article = document.querySelectorAll(
  "article.md-content__inner.md-typeset > *:not(.highlight)"
);
const embed_id_regex = /\^\w+\s*$/gi;
for (let i = 0; i < article.length; i++) {
  const embed_id = article[i].innerText.match(embed_id_regex);
  if (embed_id) {
    article[i].innerHTML = article[i].innerText.replace(embed_id, "");
  }
}
document.innerText = article; 

var cite = document.querySelectorAll(".citation");
if (cite) {
  for (var i = 0; i < cite.length; i++) {
    var img = cite[i].innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
    if (img) {
      for (var j = 0; j < img.length; j++) {
        cite[i].innerHTML = cite[i].innerHTML.replace(img[j], "");
      }
      if (cite[i].innerText.trim().length < 2) {
        cite[i].style.display = "none";
      }
    }
  }
}

window.onload = function () {
  let frameElement = document.querySelector("iframe");
  if (!frameElement) {
    return;
  }
  /** get all file in assets/stylesheets */
  let fileInStylesheets = [];
  let files = document.querySelectorAll("link");
  files.forEach((file) => {
    if (file.href.endsWith(".css")) {
      fileInStylesheets.push(file.href);
    }
  });
  let doc = frameElement.contentDocument || frameElement.contentWindow.document;
  /**
   * add all file in assets/stylesheets to iframe
   */
  fileInStylesheets.forEach((file) => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    link.type = "text/css";
    doc.head.appendChild(link);
  });
  const theme = document.querySelector("[data-md-color-scheme]");
  /** get slate bg */

  if (theme.getAttribute("data-md-color-scheme") === "default") {
    doc.body.setAttribute("class", "light");
  } else {
    doc.body.setAttribute("class", "dark");
    const bgColor = getComputedStyle(theme).getPropertyValue("--md-default-bg-color");
    doc.body.style.setProperty("--md-default-bg-color", bgColor);
  }
  doc.body.classList.add("graph-view");
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        doc.body.setAttribute(
          "class",
          mkDocsChirpyTranslator[theme.dataset.mdColorScheme]
        );
      }
    });
  });
  observer.observe(theme, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });
};

var paletteSwitcher1 = document.getElementById("__palette_1");
var paletteSwitcher2 = document.getElementById("__palette_2");

const isMermaidPage = document.querySelector(".mermaid");
if (isMermaidPage) {
  paletteSwitcher1.addEventListener("change", function () {
    location.reload();
  });

  paletteSwitcher2.addEventListener("change", function () {
    location.reload();
  });
}
