import { BibtexEntry, BibtexParser } from "./bibtexParse";
import { LinkSubscriber, Link, ReferenceType } from "../md-link/md-link-files";
import { Component, Prop, Element, h, State } from "@stencil/core";
import { MdLinkStorage } from "../md-link/md-link-storage";

@Component({
  tag: "md-bib"
})
export class Bibliography implements LinkSubscriber {
  @Prop() format: string;
  @Prop() src: string;
  @Element() host: HTMLElement;

  ranking: { [key: string]: number; };

  @State() items: BibtexEntry[];
  @State() forceRerender: boolean;


  componentWillLoad() {
    this.items = [];
    this.ranking = {};
    var bib = this.host;
    this.host.childNodes.forEach(async i => {
      switch (i.nodeName.toLowerCase()) {
        case "md-bib-doi":
          bib.removeChild(i);
          await this.addBibItemFromDoi(i.textContent || "", (i as HTMLElement).id).then(item => { this.items = [...this.items, item]; });
          break;
        case "md-bib-url":
          bib.removeChild(i);
          let newItem = this.addBibItemFromUrl(i);
          this.items = [...this.items, newItem]
          await this.addToStorage(newItem);
          break;
        case "#text" || "md-bib-item" || "h1":
          break;
        default:
          console.warn("Unknown type: " + i.nodeName.toLowerCase());
          break;
      }
    });

    if(this.src != undefined) {
      this.loadFromSource();
    }
  }

  async addToStorage(entry: BibtexEntry) {
    let storage = document.querySelector("md-link-storage") as unknown as MdLinkStorage;
    await storage.subscribe(entry.citationKey, this);
    await storage.update(entry.citationKey, {
      displayValue: this.formatBib(entry, -1),
      type: ReferenceType.reference,
      href: "#ref-" + entry.citationKey,
      index: -1,
      isUsed: false
    });
  }

  render() {
    return <div>
      <h1>Bibliography</h1>
      {this.items.sort((a, b) => {
        var ranka = this.ranking[a.citationKey] || -1;
        var rankb = this.ranking[b.citationKey] || -1;
        return ranka - rankb;
      }).map((i, number) => <md-bib-item name={this.formatBib(i, number)} bibitem={i}></md-bib-item>)}
    </div>
  }

  async loadFromSource() {
    let text = await (await fetch(this.src)).text();

    let newItems = new BibtexParser().toJSON(text);

    newItems.forEach(bibitem => {
      if (bibitem instanceof BibtexEntry) {
        this.items = [...this.items, bibitem];
        this.addToStorage(bibitem);
      }
    });
  }

  async onReferenceChanged(id: string, lnk: Link) {
    if (this.ranking[id] !== lnk.index) {
      this.ranking[id] = lnk.index;
      let bibItem = this.items.filter(i => i.citationKey === id)[0];
      lnk.displayValue = this.formatBib(bibItem, lnk.index);
      this.forceRerender = !this.forceRerender;

      let storage = document.querySelector("md-link-storage") as unknown as MdLinkStorage;
      await storage.update(id, lnk);
    }
  }

  addBibItemFromUrl(element: ChildNode): BibtexEntry {
    const htmlElement = (element as HTMLElement);
    let url = htmlElement.textContent || "";

    var parser = document.createElement('a');
    parser.href = url;

    let date;
    try {
      let dateString = htmlElement.getAttribute("accessed");
      date = new Date(dateString);
    } catch {
      date = Date.now();
    }

    return {
      citationKey: htmlElement.id || parser.hostname + ":online",
      entryType: "misc",
      entryTags: {
        title: parser.pathname.replace(/\//g, " ") + " from " + parser.host,
        url: url,
        author: parser.host,
        year: new Date().getFullYear().toString(),
        note: "(Accessed on " + date.toDateString() + ")"
      }
    };
  }

  async addBibItemFromDoi(text: string, id: string): Promise<BibtexEntry> {
    var req = new Request("https://dx.doi.org/" + text);
    req.headers.append("Accept", "application/x-bibtex; q = 1");
    // req.headers.append("Access-Control-Allow-Origin", "*");
    var res = await fetch(req);
    var textual = await res.text();
    var doi = new BibtexParser().toJSON(textual)[0] as BibtexEntry;
    doi.citationKey = id || doi.citationKey;
    return doi;
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
}

/*export class BibliographyOld extends HTMLElement implements LinkSubscriber {
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
        this.format = this.getAttribute("format") || "{refnumber}";
        this.src = this.getAttribute("src") || "";

        let header = document.createElement("h1");
        header.innerHTML = "";
        bib.appendChild(header);

        bib.startAlgorithm();
    }

    render() {
      return <div></div>
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

        var entry = new BibtexEntry();
        entry.citationKey = id
        entry.entryType = "misc";
        entry.entryTags = {};
        entry.entryTags["title"] =
        entry.entryTags["url"] = url;
        entry.entryTags["author"] = parser.host;
        entry.entryTags["year"] = new Date().getFullYear().toString();
        entry.entryTags["note"] = "(Accessed on " + date.toDateString() + ")";
        return entry;

    }

    async addBibItemFromDoi(text: string, id: string): Promise<BibtexEntry> {
        var req = new Request("https://dx.doi.org/" + text);
        req.headers.append("Accept", "application/x-bibtex; q = 1");
        // req.headers.append("Access-Control-Allow-Origin", "*");
        var res = await fetch(req);
        var textual = await res.text();
        var doi = new BibtexParser().toJSON(textual)[0] as BibtexEntry;
        doi.citationKey = id || doi.citationKey;
        return doi;
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
      bib.appendChild(item);
        item.setAttribute("bibitem", JSON.stringify(bibitem));
        item.setAttribute("refnumber", bib.number.toString());
        item.setAttribute("name", bib.formatBib(bibitem, bib.number));
        item.setAttribute("order", "100000000");
        item.setAttribute("tag-id", bibitem.citationKey);

        const myNumber = bib.number;
        bib.number++;

        this.bibtex = this.bibtex.concat([bibitem]);
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
*/
