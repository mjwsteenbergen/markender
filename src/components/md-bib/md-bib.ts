import { BibtexEntry, BibtexParser, AbstractBibtexEntry } from "./bibtexParse";
import { ReferenceType, LinkSubscriber, Link, getLinkStorage } from "../md-link/md-link-storage";
import { MdBibItem } from "../md-bib-item/md-bib-item";

export class Bibliography extends HTMLElement implements LinkSubscriber {
    bibtex: BibtexEntry[];
    src: string;
    format: string;
    excludeElements: string[];
    template: HTMLTemplateElement = document.createElement('template');
    number: number;

    constructor() {
        super();
        this.excludeElements = ["pre"];
        this.format = "";
        this.bibtex = new Array<BibtexEntry>();
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
                    bib.addBibItem(bib.addBibItemFromUrl(i), bib);
                    break;
                case "#text" || "md-bib-item" || "h1":
                    break;
                default:
                    console.warn("Unknown type: " + i.nodeName.toLowerCase());
                    break;
            }
        });

        bib.startAlgorithm();
    }

    addBibItemFromUrl(element: ChildNode): BibtexEntry {
        const htmlElement = (element as HTMLElement);
        let url = htmlElement.textContent || "";
        let id = htmlElement.id;
        let date;
        try {
            let dateString = htmlElement.getAttribute("accessed");
            date = new Date(dateString);
        } catch {
            date = Date.now();
            console.warn("Invalid date")
        }
        var parser = document.createElement('a');
        parser.href = url;
        var entry = new BibtexEntry();
        entry.citationKey = id || parser.hostname + ":online";
        entry.entryType = "misc";
        entry.entryTags = {};
        entry.entryTags["title"] = parser.pathname.replace(/\//g, " ") + " from " + parser.host;
        entry.entryTags["url"] = url;
        entry.entryTags["author"] = parser.host;
        entry.entryTags["year"] = new Date().getFullYear().toString();
        entry.entryTags["note"] = "(Accessed on " + date.toDateString() + ")";
        return entry;

    }

    async addBibItemFromDoi(text: string, id: string): Promise<BibtexEntry> {
        var req = new Request("http://dx.doi.org/" + text);
        req.headers.append("Accept", "application/x-bibtex; q = 1");
        // req.headers.append("Access-Control-Allow-Origin", "*");
        var res = await fetch(req);
        var textual = await res.text();
        var doi = new BibtexParser().toJSON(textual)[0] as BibtexEntry;
        doi.citationKey = id || doi.citationKey;
        return doi;
    }

    async startAlgorithm() {
        var httpRequest = new XMLHttpRequest();
        var bib = this;
        var once = false;

        let res = await fetch(this.src);
        let text = await res.text();

        let newItems = new BibtexParser().toJSON(text);

        newItems.forEach(bibitem => {
            if (bibitem instanceof BibtexEntry) {
                this.addBibItem(bibitem, bib);
            }
        });
    }

    formatBib(bibitem: BibtexEntry, refnumber: number) {
        var res = this.format.replace("{refnumber}", refnumber.toString());
        res = res.replace("{authors}", (bibitem.entryTags["author"] || ""));

        const authors = (bibitem.entryTags["author"] || "").split(/and|&/g);
        var authorString = authors[0].trimRight();
        if (authors.length > 1) {
            authorString += " et al.";
        }

        res = res.replace("{author}", authorString);

        const year = (bibitem.entryTags["year"] || "");
        res = res.replace("{year}", year);
        return res;
    }

    addBibItem(bibitem: BibtexEntry, bib: Bibliography) {
        var item = document.createElement('md-bib-item');
        item.setAttribute("bibitem", JSON.stringify(bibitem));
        item.setAttribute("refnumber", bib.number.toString());
        item.setAttribute("name", bib.formatBib(bibitem, bib.number));
        item.setAttribute("order", "100000000");
        item.setAttribute("tag-id", bibitem.citationKey);

        const myNumber = bib.number;
        bib.number++;

        this.bibtex = this.bibtex.concat([bibitem]);
        bib.appendChild(item);
        let showUnused = bib.hasAttribute("showUnused");
        getLinkStorage((storage) => {
            storage.subscribe(bibitem.citationKey, bib);
            storage.update(bibitem.citationKey, {
                reportValue: bib.formatBib(bibitem, myNumber),
                type: ReferenceType.reference,
                href: "#ref-" + bibitem.citationKey,
                index: showUnused ? Number.MAX_SAFE_INTEGER : -1,
                isUsed: false
            });
        });
    }

    onReferenceChanged(id: string, link: Link) {
        Array.from(this.children).forEach((el) => {
            if (el.getAttribute("tag-id") === id) {
                el.setAttribute("order", link.index.toString());
            }
        });

        if(!this.hasAttribute("disableSort")) {
            this.sort();
        }
    }

    sort() {
        let isSorted = true;
        while(true) {
            isSorted = true;
            for (let index = 0; index < this.children.length; index++) {
                if (index + 1 == this.children.length) {
                    continue;
                }
                const element = this.children[index] as HTMLElement;
                const myIndex = Number.parseInt(element.getAttribute("order"));

                const nextElement = this.children[index + 1] as HTMLElement;
                const nextIndex = Number.parseInt(nextElement.getAttribute("order"));

                if(myIndex > nextIndex) {
                    isSorted = false;
                    this.insertBefore(nextElement, element)
                }
            }

            if(isSorted) {
                break;
            }
        }

        let refNumber = 1;
        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if(element instanceof MdBibItem) {
                let citationKey = element.getAttribute("tag-id");
                const item = this.bibtex.find(i => i.citationKey === citationKey)

                if (item === undefined) {
                    continue;
                }

                if (Number.parseInt(element.getAttribute("order")) === -1 && !this.hasAttribute("showUnused")) {
                    continue;
                }

                element.setAttribute("refnumber", refNumber.toString());
                let newreportValue = this.formatBib(item, refNumber)
                element.setAttribute("name", newreportValue);
                refNumber++;
                getLinkStorage(storage => {
                    let item = storage.values[citationKey];
                    if(item === undefined) {
                        return;
                    }
                    if(item.reportValue !== newreportValue) {
                        item.reportValue = newreportValue;
                        storage.update(citationKey, item);
                    }
                });
            }
        }
    }
}
