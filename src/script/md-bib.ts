import { BibtexParser, AbstractBibtexEntry, BibtexEntry, BibtexEntryComment,BibtexEntryPreamble } from "./bibtexParse";

export class Bibliography extends HTMLElement{
    bibtex: AbstractBibtexEntry[];
    src: string;
    format: string;
    excludeElements: string[];
    template: HTMLTemplateElement = document.createElement('template');

    constructor() {
        super();
        this.excludeElements = ["pre"];
        this.format = null;
        this.bibtex = null;
    }

    connectedCallback() {
        var bib = this;
        this.format = this.getAttribute("format") || "[{refnumber}]";
        this.src = this.getAttribute("src");

        let header = document.createElement("h1");
        header.innerHTML = "Bibliography";
        this.appendChild(header);

        
        document.addEventListener("readystatechange", function(event) {
            if(document.readyState !== "complete") return;
            var storage = bib.getLinkStorageOrCreate();
            bib.startAlgorithm(storage);
        });

        // this.appendChild(this.template);
        
    }

    startAlgorithm(storage) {
        var httpRequest = new XMLHttpRequest();
        var bib = this;
        var once = false;

        httpRequest.onreadystatechange = function(e){
            if (httpRequest.status === 200 && httpRequest.responseText !== "") {
                if(once) {
                    return;
                }
                once = true;
                var bibtex = httpRequest.responseText;
                bib.bibtex = new BibtexParser().toJSON(bibtex);
                var number = 1;
                console.log(bib.bibtex[0]);
                bib.bibtex.forEach(function(bibitem){
                    if(bibitem instanceof BibtexEntry){
                        var name = bib.format.replace("{refnumber}", number.toString());
                        storage.setLink(bibitem.citationKey, name, "#bib-item-" + number)
                        bib.addBibItem(bibitem, number, bib);
                        number++;                                 
                    }
                });
                console.log("done");
            }
            else {
                console.error(httpRequest.status);  
            }
        };
        httpRequest.open('GET', this.src, true);
        httpRequest.send();            
    }

    formatBib(bibitem, refnumber)
    {
        var res = this.format.replace("{refnumber}", refnumber);
        return "<a href=\"" + "#bib-item-" + refnumber +"\">" + res + "</a>";
    }

    getLinkStorageOrCreate() {
        var storage = document.getElementsByTagName("md-link-storage");
        if(storage.length > 0) {
            return storage[0];
        } else {
            // var storage = document.createElement("md-link-storage");
            // document.body.appendChild(storage);
            return storage;
        }

    }

    addBibItem(bibitem, refnumber, bib)
    {
        var item = document.createElement('md-bib-item');
        item.setAttribute("bibitem", JSON.stringify(bibitem));
        item.setAttribute("refnumber", refnumber);
        item.setAttribute("name", this.formatBib(bibitem, refnumber));

        bib.appendChild(item);
    }
}

    window.customElements.define('md-bib', Bibliography);