
export function getDropboxStyle(): string {
    return /* css */ `
    
@font-face {
	font-family: 'AtlasM';
	font-weight: normal;
	font-style: normal;
	src: url('https://d1fldwwydewvss.cloudfront.net/static/fonts/AtlasGrotesk-Medium-Web.woff2') format('woff');
}

@font-face {
	font-family: 'AtlasR';
	font-weight: normal;
	font-style: normal;
	src: url('https://d1fldwwydewvss.cloudfront.net/static/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff');
}

@font-face {
	font-family: 'AtlasL';
	font-weight: normal;
	font-style: normal;
	src: url('https://d1fldwwydewvss.cloudfront.net/static/fonts/AtlasGrotesk-Light-Web.woff2') format('woff');
}


@page {
	margin-top: 80px;
	margin-bottom: 80px; 
    margin-left: 2.5cm;
    margin-right: 2.5cm;
}

body {
    font-family: 'AtlasR';
    font-size: 10pt;
	/*margin: 3cm;*/
	color: #1b2733;
}

h1 {
    font-family: 'AtlasR';
    font-weight: normal;
}

h2 {
	font-family: 'AtlasL';
	font-weight: normal;
}

h3 {
	font-family: 'AtlasM';
	font-weight: normal;
}

pre {
	margin: 2px;
	padding: 10px;
	border: 1px solid rgb(230, 232, 235);
	background-color: #f7f9fa;
	font-family: SourceCodePro,monospace;
}

/* md-cover */

.md-cover-title {
	font-family: 'AtlasR';
	font-size: 40px;
	color: #1b2733;
}

md-cover-date {
	visibility: hidden;
}

/* md-toc */

md-toc-item {
	margin-top: 3px;
}

/* todo's */

en-todo {
	background-repeat: no-repeat;
    background-image: url('./img/checkbox-dropbox.png');
	margin-left: -17px;	
}

en-todo[checked="true"] {
    background-image: url('./img/checkbox-dropbox-checked.png');
}

`
}