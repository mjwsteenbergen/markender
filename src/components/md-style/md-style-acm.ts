
export function getACMStyle(): string {
    return /* css */ `
    
@font-face {
	font-family: 'Libertine';
	font-weight: normal;
	font-style: normal;
    src: url('https://cdn.rawgit.com/mjwsteenbergen/markender/master/src/css/fonts/LinuxBiolinum/LinLibertine_R.otf') format('opentype');
}

@font-face {
	font-family: 'LibertineB';
	font-weight: normal;
	font-style: normal;
    src: url('https://cdn.rawgit.com/mjwsteenbergen/markender/master/src/css/fonts/LinuxBiolinum/LinLibertine_RB.otf') format('opentype');
}

@font-face {
	font-family: 'BiolinumBold';
	font-weight: normal;
	font-style: normal;
    src: url('https://cdn.rawgit.com/mjwsteenbergen/markender/master/src/css/fonts/LinuxBiolinum/LinBiolinum_RB.ttf') format('woff');
}

@font-face {
	font-family: 'Biolinum';
	font-weight: normal;
	font-style: normal;
    src: url('https://cdn.rawgit.com/mjwsteenbergen/markender/master/src/css/fonts/LinuxBiolinum/LinBiolinum_R.ttf') format('woff');
}

@page {
    margin-top: 2.65cm;
    margin-left: 1.9cm;
    margin-bottom: 2.82cm;
    margin-right: 1.9cm;
}

md-cover div {
    column-span: all;
}

h1 {
    font-family: "LibertineB";
    /* font-weight: bold; */
    text-transform: uppercase;
    font-size: 11pt;
    margin: 0;
    padding-top: 10px;
    border-bottom-style: none;
}

h2 {
    font-family: "BiolinumBold";
    font-weight: bold;
    font-size: 11pt;
}

body {
    font-family: "Libertine";
    font-size: 11pt;
    margin: 0;
}

stl-chooser {
    column-count: 1;
}

body {
    column-count: 2;
}

/*Extra Items*/
md-cover {
    display: block;
  }
  
  md-cover-title {
    font-family: "BiolinumBold";
    font-weight: bold;
    font-size: 17.5pt;
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
    padding-bottom: 30px;    
  }
  
  md-cover-date {
    display: none;
  }

  md-img div span {
      font-weight: bold;
  }

  a {
      color: black;
  }
  
    md-bib p {
        margin: 0;
    }


`
}