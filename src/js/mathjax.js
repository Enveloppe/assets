/**
 * @file MathJax
 * @see Material for MkDocs: https://squidfunk.github.io/mkdocs-material/
 * @description Must be loaded BEFORE polyfills.js scripts
 */

window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
};

document$.subscribe(() => {
  MathJax.typesetPromise();
});
