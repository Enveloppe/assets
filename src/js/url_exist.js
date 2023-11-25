/**
 * @file URLEXIST
 * @overview Check if the url exists
 * @description Create a special class & remove link if the url does not exist
 */

/**
 * Correct some bug in mkdocs creation for links
 * @param {URL} url
 * @param {number} typeURL
 * @returns
 */
function parseURL(url, typeURL) {

    let ref = "";
    let title = "";
    if (typeURL === 0) {
        ref = url.href;
        title = url.title;
    } else if (typeURL === 1) {
        ref = url.src;
        title = url.alt;
    }
    if (ref.match(/index$/)) {
        ref = ref.replace(/index$/, "");
    }
    if (ref.includes("%5C")) {
        ref = ref.replace(/%5C/g, "/");
    }
    if (ref.match(/\.md\/$/)) {
        ref = ref.replace(/\.md\/$/, "/");
    }
    ref = decodeURI(ref);
    if (typeURL === 0) {
        url.href = ref;
        url.title = title;
        if (title.length === 0) {
            title = url.innerText;
            url.title = title;
        }
    } else if (typeURL === 1) {
        url.src = ref;
        url.alt = title;
    }
    return {
        title,
        ref,
        url
    };
}

/**
 * Use search/all_files.json to check if the url exists
 * @param {URL} url
 * @param {string} ref
 * @param {string} title
 * @param {string[]} history
 * @returns {string[]} history
 */
function checkIfInternalLinksExists(ref, title, url, history) {
    //return if the url is not internal
    //verify by checking if the url starts with the blog url
    let cleanURL = url.href.replace(url.host, "").replace(/http(s)?:(\/){1,3}/gi, "").replace(/^\//, "");
    cleanURL = cleanURL.trim().length === 0 ? "./" : decodeURI(cleanURL).toLowerCase();
    const blogURL = document.querySelector('meta[name="site_url"]').content;
    const part = `${blogURL.split("/").filter((part) => part.length > 0).pop()}/`;

    /** get last part of the url, like wiki in 127.0.0.1:8000/wiki/ */
    cleanURL = cleanURL.replace(part.replace(/^\//, ""), "");

    if (!history.includes(cleanURL.replace(/\/$/, "")) && cleanURL !== "./") {
        fetch(`${blogURL}/search/all_files.json`)
            .then((response) => response.json())
            .then((json) => {
                json.forEach((doc) => {
                    const docURL = decodeURI(doc.url).toLowerCase();
                    if (docURL === cleanURL) {
                        history.push(cleanURL.replace(/\/$/, ""));
                    }
                });
                history = [...new Set(history)];
                if (!history.includes(cleanURL.replace(/\/$/, "")) && cleanURL !== "./") {
                    const newItem = document.createElement("div");
                    newItem.innerHTML = title;
                    newItem.classList.add("not_found");
                    newItem.setAttribute("href", ref);
                    try {
                        url.parentNode.replaceChild(newItem, url);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return history;
}

let history = [];
const ht = document.querySelectorAll("a:not(img)");
for (const anchor of ht) {
    if (
        !anchor.getElementsByTagName("img").length > 0 &&
        !anchor.getElementsByTagName("svg").length > 0 &&
        !anchor.href.includes("#") &&
        anchor.hostname === window.location.hostname
    ) {
        var link = parseURL(anchor, 0);
        history = checkIfInternalLinksExists(link.ref, link.title, anchor, history);
    }
}

const img = document.querySelectorAll("img");
for (const image of img) {
    if (image.hostname === window.location.hostname) {
        var link = parseURL(image, 1);
        history = checkIfInternalLinksExists(link.ref, link.title, image, history);
    }
}