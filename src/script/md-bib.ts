import { BibtexParser, AbstractBibtexEntry, BibtexEntry, BibtexEntryComment,BibtexEntryPreamble } from "./bibtexParse";

export class Bibliography extends HTMLElement{
    bibtex: AbstractBibtexEntry[];
    src: string;
    format: string;
    excludeElements: string[];
    template: HTMLTemplateElement = document.createElement('template');
    number: number;

    constructor() {
        super();
        this.excludeElements = ["pre"];
        this.format = null;
        this.bibtex = new Array<AbstractBibtexEntry>();
        this.number = 1;
    }

    connectedCallback() {
        var bib = this;
        this.format = this.getAttribute("format") || "[{refnumber}]";
        this.src = this.getAttribute("src");

        let header = document.createElement("h1");
        header.innerHTML = "Bibliography";
        bib.appendChild(header);

        document.addEventListener("readystatechange", function(event) {
            console.warn("Nodes");
            if (document.readyState !== "complete") return;

            bib.childNodes.forEach(i => {
                console.log(i);
                switch (i.nodeName.toLowerCase()) {
                    case "md-bib-doi":
                        bib.removeChild(i);
                        bib.addBibItemFromDoi(i.textContent, (i as HTMLElement).id).then(item => { console.log(item); bib.addBibItem(item, bib)})
                        break;
                    case "md-bib-url":
                        bib.removeChild(i);                        
                        bib.addBibItem(bib.addBibItemFromUrl(i.textContent, (i as HTMLElement).id), bib);
                        break;
                    case "#text":
                        break;
                    default:
                        console.log("Unknown type: " + i.nodeName)
                        break;
                }
                console.log(bib.bibtex);
            });

            
            bib.startAlgorithm();

            
        });

        // this.appendChild(this.template);
        
        
    }

    addBibItemFromUrl(url: string, id:string) : BibtexEntry {
        //this.getReference([], ["author", "title", "howpublished", "month", "year", "note", "key", "url"]);
        var parser = document.createElement('a');
        parser.href = url;
        var entry = new BibtexEntry();
        entry.citationKey =  id || parser.hostname + ":online";
        entry.entryType = "misc";
        entry.entryTags = new Map();
        entry.entryTags["title"] = parser.pathname.replace(/\//g, " ") + " from " + parser.host;
        entry.entryTags["url"] = url;
        entry.entryTags["note"] = "(Accessed on " + new Date(Date.now()).toDateString() + ")"
        return entry;

    }

    async addBibItemFromDoi(text: string, id: string) : Promise<AbstractBibtexEntry>    {
        console.log("doi", text);
        var req = new Request("http://dx.doi.org/" + text);
        req.headers.append("Accept", "application/x-bibtex; q = 1");
        var res = await fetch(req);
        var textual = await res.text();
        var doi = new BibtexParser().toJSON(textual)[0] as BibtexEntry;
        doi.citationKey = id || doi.citationKey;
        return doi;
    }

    startAlgorithm() {
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
                bib.bibtex = bib.bibtex.concat(new BibtexParser().toJSON(bibtex));
                bib.bibtex.forEach(function(bibitem){
                    if(bibitem instanceof BibtexEntry){
                        bib.addBibItem(bibitem, bib);
                    }
                });
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

    addBibItem(bibitem, bib)
    {
        var item = document.createElement('md-bib-item');
        item.setAttribute("bibitem", JSON.stringify(bibitem));
        item.setAttribute("refnumber", this.number.toString());
        item.setAttribute("name", this.formatBib(bibitem, bib.number));

        bib.appendChild(item);

        var storage = bib.getLinkStorageOrCreate();
        storage.setLink(bibitem.citationKey, this.formatBib(bibitem, bib.number), "#bib-item-" + bib.number);
        this.number++;
    }
}

    window.customElements.define('md-bib', Bibliography);