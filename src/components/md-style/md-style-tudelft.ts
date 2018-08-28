
export function getTuDelftStyle(): string {
    return /* css */ `
    
@font-face {
	font-family: 'TUDul';
	font-weight: normal;
	font-style: normal;
	src: url('./fonts/TUDelft-UltraLight.ttf');
}

@page {
	margin-left: 120px;
	margin-right: 120px;
	margin-top: 80px;
	margin-bottom: 80px; 
    background-color: green;
}

body {
    font-family: Arial;
    word-wrap: break-word;
}

h1, h2, h3 {
    color: rgb(0, 166, 214);
}

@page :first {
    
}

@page :first {
    margin: 0;
}

md-cover div::after  { 
    height: 500px;
    width: 300px;
    background-image: url("http://www.tudelft.nl/fileadmin/Files/medewerkersportal/mc/huisstijl/Downloads/TU_Delft_logo_White.png");
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 1500px;
    margin-left: -50px;
    content: "";
 }

md-cover div{
    background-color: rgb(230, 70, 22);
    background-size: 1300px;
    margin-top: -1em;
    margin-left: -8px;
    margin-right: -8px;
    height: 1680px;
}

md-cover div md-cover-author {
    position: absolute;
    font-family: Georgia, 'Times New Roman', Times, serif;
    top: 100px;
    left: 100px;
    color: white;
    font-size: 25pt;
}

md-cover div md-cover-title {
    position: absolute;
    color: white;
    font-size: 150pt;
    font-family: 'TUDul';
    width: 1030px;
    padding-right: 150px;
    /*padding-left: 100px;
    padding-top: 150px;*/
    padding-bottom: 20px;
    border-top: 1px solid white;

    
    margin-top: 175px;
    margin-left: 100px;
    margin-right: 100px;
    padding-left: 0px;

}

md-cover div md-cover-date {
    visibility: hidden
}
`
}