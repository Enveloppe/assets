/**
 * @file Misc
 * @description Various file links and patch I was to lazy to do in mkdocs
 */

//patch a href attributes
const header_links = document.querySelectorAll("a[href*=\"#\"]");
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


for (const i of document.querySelectorAll("img")) {
	const resize = /^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/gi;
	if (i.alt.match(resize)) {
		const match = resize.exec(i.alt ?? "");
		i.width = match.groups.width ?? i.width;
		i.height = match.groups.height ?? i.height;
		i.alt = match.groups.alt ?? i.alt;
		
	}
}

//remove ^id from contents ;
// Only work in the form of "content ^id" (and ^id must end the lines)
const article = document.querySelectorAll(
	"article.md-content__inner.md-typeset > *:not(.highlight)"
);
const embed_id_regex = /\^\w+\s*$/gi;
for (const element of article) {
	const embed_id = element.innerText.match(embed_id_regex);
	if (embed_id) {
		element.innerHTML = element.innerText.replace(embed_id, "");
	}
}
document.innerText = article;

const cite = document.querySelectorAll(".citation");
if (cite) {
	for (const elem of cite) {
		const img_cite = elem.innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
		if (img_cite) {
			for (const element of img_cite) {
				elem.innerHTML = elem.innerHTML.replace(element, "");
			}
			if (elem.innerText.trim().length < 2) {
				elem.style.display = "none";
			}
		}
	}
}

window.onload = function () {
	const frameElement = document.querySelector("iframe");
	if (!frameElement) {
		return;
	}
	/** get all file in assets/stylesheets */
	const fileInStylesheets = [];
	const files = document.querySelectorAll("link");
	files.forEach((file) => {
		if (file.href.endsWith(".css")) {
			fileInStylesheets.push(file.href);
		}
	});
	const doc = frameElement.contentDocument || frameElement.contentWindow.document;
	fileInStylesheets.forEach((file) => {
		const link = document.createElement("link");
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
};

const paletteSwitcher1 = document.getElementById("__palette_1");
const paletteSwitcher2 = document.getElementById("__palette_2");

const isMermaidPage = document.querySelector(".mermaid");
if (isMermaidPage) {
	paletteSwitcher1.addEventListener("change", () => {
		location.reload();
	});

	paletteSwitcher2.addEventListener("change", () => {
		location.reload();
	});
}
