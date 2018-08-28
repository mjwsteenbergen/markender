import { getLatexStyle } from "./md-style/md-style-latex";
import { getSomnoxStyle } from "./md-style/md-style-somnox";
import { getTuDelftStyle } from "./md-style/md-style-tudelft";
import { getDropboxStyle } from "./md-style/md-style-dropbox";
import { getGithubStyle } from "./md-style/md-style-github";
import { getACMStyle } from "./md-style/md-style-acm";
import { getBasicStyle } from "./md-style/md-style-basic";

export class MdStyle extends HTMLElement {
    
    connectedCallback() {
        var s = document.getElementById("default-styles");
        if (s !== null) {
            s.remove();
        }

        document.querySelectorAll("style").forEach(i => {
            if (i.innerHTML.includes(".vscode")) {
                i.remove();
            }
        });

        // var codeUrl = "";
        // document.querySelectorAll("script").forEach(i => {
        //     var src = i.getAttribute("src");
        //     if (src !== null && src.endsWith("dist/main.js")) {
        //         codeUrl = src.replace("dist/main.js", "src/css/");
        //     }
        // });

        var name = this.getAttribute("name");
        var style = document.createElement("style");
        style.innerHTML = getBasicStyle();

        switch (name) {
            case "acm":
                style.innerHTML += getACMStyle();
                break;
            case "github":
                style.innerHTML += getGithubStyle();
                break;
            case "dropbox":
                style.innerHTML += getDropboxStyle();
                break;
            case "latex-report":
                style.innerHTML += getLatexStyle();
                break;
            case "latex":
                style.innerHTML += getLatexStyle();
                break;
            case "somnox":
                style.innerHTML += getSomnoxStyle();
                break;
            case "tudelft":
                style.innerHTML += getTuDelftStyle();
                break;
            case "" || null: 
                break;
            default:

                break;
        }
        document.head.appendChild(style);


        // var style = document.createElement("link");
        // style.setAttribute("rel", "stylesheet");
        // style.setAttribute("type", "text/css");
        // style.setAttribute("href", codeUrl + name + ".css");
        // this.appendChild(style);

        
    }
}