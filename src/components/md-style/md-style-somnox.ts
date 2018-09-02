
export function getSomnoxStyle(): string {
    return /* css */ `
    
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i');

@page {
	margin-left: 120px;
	margin-right: 120px;
	margin-top: 80px;
	margin-bottom: 80px; 
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 10pt;
}

h1 {
    font-family: 'Source Sans Pro';
    font-weight: 300;
}

h2 {
    font-weight: 400;
    color: #515b69;    
}

h3, h4 {
    font-weight: 400;    
    color: #515b69;
}

a {
    color: rgb(37, 170, 225);
    font-weight: 600;
    text-decoration: none;
    /*border-bottom: 1px solid black;*/
}

table, th, td {
    border-right: none !important; 
    border-left: none !important;
}

en-todo {
	background-repeat: no-repeat;
    background-image: url('./img/checkbox-latex.svg');	
	margin-bottom: 5px;
}

en-todo[checked="true"] {
    background-image: url('./img/checkbox-latex-checked.svg');
}

.md-toc-item-name {
    font-weight: 400;    
}

md-cover {
  margin-top: 150px;
  display: block;
  margin-bottom: 50px;
}

md-cover-title {
  font-size: 20pt;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-weight: 300;
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

h1 {
	page-break-before: always;
}

`
}