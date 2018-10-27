import { AbstractBibtexEntry, BibtexEntry, BibtexParser } from "./bibtexParse";
import { MdLinkStorage } from "../md-link/md-link-storage";

export class Bibliography extends HTMLElement {
    bibtex: AbstractBibtexEntry[];
    src: string;
    format: string;
    excludeElements: string[];
    template: HTMLTemplateElement = document.createElement('template');
    number: number;

    constructor() {
        super();
        this.excludeElements = ["pre"];
        this.format = "";
        this.bibtex = new Array<AbstractBibtexEntry>();
        this.number = 1;
        this.src = "";
    }

    connectedCallback() {
        var bib = this;
        this.format = this.getAttribute("format") || "{refnumber}";
        this.src = this.getAttribute("src") || "";

        let header = document.createElement("h1");
        header.innerHTML = "Bibliography";
        bib.appendChild(header);
        bib.childNodes.forEach(i => {
            switch (i.nodeName.toLowerCase()) {
                case "md-bib-doi":
                    bib.removeChild(i);
                    bib.addBibItemFromDoi(i.textContent || "", (i as HTMLElement).id).then(item => { bib.addBibItem(item, bib); });
                    break;
                case "md-bib-url":
                    bib.removeChild(i);
                    bib.addBibItem(bib.addBibItemFromUrl(i.textContent || "", (i as HTMLElement).id), bib);
                    break;
                case "#text" || "md-bib-item" || "h1":
                    break;
                default:
                    console.log("Unknown type: " + i.nodeName.toLowerCase());
                    break;
            }
        });


        bib.startAlgorithm();


        // });

        // this.appendChild(this.template);


    }

    addBibItemFromUrl(url: string, id: string): BibtexEntry {
        //this.getReference([], ["author", "title", "howpublished", "month", "year", "note", "key", "url"]);
        var parser = document.createElement('a');
        parser.href = url;
        var entry = new BibtexEntry();
        entry.citationKey = id || parser.hostname + ":online";
        entry.entryType = "misc";
        entry.entryTags = {};
        entry.entryTags["title"] = parser.pathname.replace(/\//g, " ") + " from " + parser.host;
        entry.entryTags["url"] = url;
        entry.entryTags["note"] = "(Accessed on " + new Date(Date.now()).toDateString() + ")";
        return entry;

    }

    async addBibItemFromDoi(text: string, id: string): Promise<BibtexEntry> {
        var req = new Request("http://dx.doi.org/" + text);
        req.headers.append("Accept", "application/x-bibtex; q = 1");
        // req.headers.append("Access-Control-Allow-Origin", "*");
        var res = await fetch(req);
        var textual = await res.text();
        console.log({textual});
        var doi = new BibtexParser().toJSON(textual)[0] as BibtexEntry;
        doi.citationKey = id || doi.citationKey;
        return doi;
    }

    startAlgorithm() {
        var httpRequest = new XMLHttpRequest();
        var bib = this;
        var once = false;

        httpRequest.onreadystatechange = function (e) {
            if (httpRequest.status === 200 && httpRequest.responseText !== "") {
                if (once) {
                    return;
                }
                once = true;
                var bibtex = httpRequest.responseText;
                bib.bibtex = bib.bibtex.concat(new BibtexParser().toJSON(bibtex));
                bib.bibtex.forEach(function (bibitem) {
                    if (bibitem instanceof BibtexEntry) {

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

    formatBib(bibitem: BibtexEntry, refnumber: number) {
        var res = this.format.replace("{refnumber}", refnumber.toString());
        return res;
    }

    getLinkStorageOrCreate(): MdLinkStorage {
        var storage = document.getElementsByTagName("md-link-storage");
        if (storage.length > 0) {
            return storage[0] as MdLinkStorage;
        } else {
            throw new Error("Link Storage was not found");
        }

    }

    addBibItem(bibitem: BibtexEntry, bib: Bibliography) {
        var item = document.createElement('md-bib-item');
        item.setAttribute("bibitem", JSON.stringify(bibitem));
        item.setAttribute("refnumber", bib.number.toString());
        item.setAttribute("name", bib.formatBib(bibitem, bib.number));
        const myNumber = bib.number;
        bib.number++;

        bib.appendChild(item);
        // document.addEventListener("load", function (event) {
        var storage = bib.getLinkStorageOrCreate();
        this.addBibItemToLink(storage, bibitem.citationKey, bib.formatBib(bibitem, myNumber), "#bib-item-" + myNumber, bib);

        // document.addEventListener("readystatechange", function (event) {
        //     if (document.readyState !== "complete") { return; }
        //     var storage = bib.getLinkStorageOrCreate();
        //     storage.setLink(bibitem.citationKey, bib.formatBib(bibitem, myNumber), "#bib-item-" + myNumber, bib);
        // });
    }

    addBibItemToLink(storage: MdLinkStorage, id: string, name: string, href: string, bib: Bibliography) {
        if (storage.setLink === undefined) {
            setTimeout(() => {
                this.addBibItemToLink(storage, id, name, href, bib);
            }, 200);
        } else {
            storage.setLink(id, name, href, bib);
        }
    }
}
