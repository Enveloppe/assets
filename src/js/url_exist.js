/**
 * Use search/all_files.json to check if the url exists
 * @param {URL} url 
 * @param {string} ref
 * @param {string} title
 */
function checkIfInternalLinksExists(ref, title, url) {
    //return if the url is not internal
    //verify by checking if the url starts with the blog url

    fetch("/search/all_files.json")
        .then((response) => response.json())
        .then((json) => {

            let cleanURL = url.href.replace(url.host, "").replace(/http(s)?:(\/){1,3}/gi, "");
            cleanURL = cleanURL.length === 0 ? "./" : cleanURL;
            const test = json.some((doc) => {
                return decodeURI(doc.url) === decodeURI(cleanURL);
            });

            if (!test) {
                console.log(`${decodeURI(cleanURL)} does not exist`)
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

var p_search = /\.{2}\//gi;
var ht = document.querySelectorAll("a:not(img)");
for (const anchor of ht) {
    if (
        !anchor.getElementsByTagName("img").length > 0 &&
        !anchor.getElementsByTagName("svg").length > 0 &&
        !anchor.href.includes("#") &&
        anchor.hostname === window.location.hostname
    ) {
        var link = parseURL(anchor, 0);
        checkIfInternalLinksExists(link.ref, link.title, anchor);
    }
}

var p_img = /\.+\\/gi;
var img = document.querySelectorAll("img");
for (const image of img) {
    if (image.hostname === window.location.hostname) {
        var link = parseURL(image, 1);
        checkIfInternalLinksExists(link.ref, link.title, image);
    }
}

