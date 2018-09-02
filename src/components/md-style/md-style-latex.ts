
export function getLatexStyle(): string {
    return /* css */ `
    
@font-face {
  font-family: 'Latin Modern Roman';
  font-weight: normal;
  font-style: normal;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmroman10-regular.woff')
    format('woff');
}

@font-face {
  font-family: 'Latin Modern Roman';
  font-weight: bold;
  font-style: normal;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmroman10-bold.woff')
    format('woff');
}

@font-face {
  font-family: 'Latin Modern Roman';
  font-weight: normal;
  font-style: italic;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmroman10-italic.woff')
    format('woff');
}

@font-face {
  font-family: 'Latin Modern Roman';
  font-weight: bold;
  font-style: italic;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmroman10-bolditalic.woff')
    format('woff');
}

@font-face {
  font-family: 'Latin Modern Mono';
  font-weight: normal;
  font-style: normal;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmmono10-regular.woff')
    format('woff');
}

@font-face {
  font-family: 'Latin Modern Mono';
  font-weight: normal;
  font-style: italic;
  src: url('https://cdn.rawgit.com/AndrewBelt/WiTeX/master/fonts/lmmono10-italic.woff')
    format('woff');
}

body {
  background: none;
  font-size: 1rem;
  font-family: 'Latin Modern Roman', serif;
  color: black;
}

.break {
  page-break-before: always;
}

/* Page Layout */
@page {
  margin-left: 120px;
  margin-right: 120px;
  margin-top: 80px;
  margin-bottom: 80px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  border: none;
  font-weight: 700;
}

h1 {
  font-size: 3rem;
}

h2 {
  font-size: 2rem;
  font-weight: normal;
}

a,
a:visited {
  color: #a00;
}

a.new,
a.new:visited {
  color: black;
}

ul {
  list-style: disc;
}

/* Content Box */
.mw-body {
  max-width: 720px;
  margin: 1em auto;
}

#content,
div#content {
  border: none;
  color: black;
}

#firstHeading,
#siteSub {
  text-align: center;
  display: block;
}

#siteSub {
  margin-top: -0.5em;
  margin-bottom: 4em;
}

/* Article Body */

.mw-body-content {
  font-size: inherit;
  text-align: justify;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  line-height: 1.5em;
}

.mw-body {
  padding: 2em 0;
}

.mw-body h1,
.mw-body h2,
.mw-body h3,
.mw-body h4,
.mw-body h5,
.mw-body h6,
div#content h1,
div#content h2,
div#content #firstHeading {
  font-family: inherit;
  line-height: 1.5em;
  margin-bottom: 0.5em;
}

.mw-body h1,
div#content h1 {
  font-size: 2em;
}

.mw-body h2,
div#content h2 {
  font-size: 1.5em;
}

.mw-body h3 {
  font-size: 1.2em;
}

.mw-body h4 {
  font-size: 1.1em;
}

.mw-body h5,
.mw-body h6 {
  font-size: 1em;
}

.mw-body p {
  margin: 0;
}

.mw-body p + p {
  text-indent: 2em;
}

.mw-editsection {
  /* hide more non-content */
  display: none;
}

table.ambox {
  margin-bottom: 1em;
}

dl dd {
  /* center definitions (most useful for display equations) */
  text-align: center;
}

span.texhtml {
  /* revert inline math to default font */
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* Table of Contents */

#toc,
.toc {
  border: none;
  padding: 0;
  background: none;
  font-size: inherit;
  /* span 100% of the width */
  display: block;
}

.mw-body #toc h2,
.mw-body .toc h2 {
  font-family: inherit;
  font-size: 1.5em;
}

#toc h2,
.toc h2 {
  display: block;
}

#toc #toctitle,
.toc #toctitle,
#toc .toctitle,
.toc .toctitle {
  text-align: left;
}

.toctoggle {
  display: none;
}

/* Figures */

div.tright {
  margin: 0.5em 0 0.5em 1.5em;
}

div.tleft {
  margin: 0.5em 1.5em 0.5em 0;
}

/* Code */

.mw-code {
  margin: 1em 0;
}

pre,
code {
  font-family: 'Latin Modern Mono', monospace !important;
}

sup {
  text-indent: 0;
}

/*Katex*/

.katex {
  font-size: 1em !important;
}

/*Extra Items*/
md-cover {
  margin-top: 150px;
  display: block;
  margin-bottom: 50px;
}

md-cover-title {
  font-size: 18pt;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

md-cover-author {
  margin-top: 15px;
  font-size: 13pt;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

md-cover-date {
  margin-top: 10px;
  font-size: 12pt;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

/* Md-img */

md-img.full {
  display: block;
  height: 200mm;
  page-break-after: always;
  page-break-before: always;
}


`
}