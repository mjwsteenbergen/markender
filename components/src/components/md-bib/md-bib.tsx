import { BibtexEntry, BibtexParser } from "./bibtexParse";
import { LinkSubscriber, Link, ReferenceType } from "../md-link/md-link-files";
import { Component, Prop, Element, h, State, Listen } from "@stencil/core";
import { MdLinkStorage } from "../md-link/md-link-storage";

@Component({
  tag: "md-bib",
  styleUrl: "md-bib.scss"
})
export class Bibliography implements LinkSubscriber {
  /**
   * Source of the bibliography (this should be in [bibtex](http://www.bibtex.org/Format/) format)
   */
  @Prop() src: string;

  /**
   * How to format the references)
   */
  @Prop() format: string = "{refnumber}";

  @Element() host: HTMLElement;

  ranking: { [key: string]: number; };

  @State() items: BibtexEntry[];
  @State() forceRerender: boolean;
  @State() showPopup: boolean;

  @Listen('shouldClose')
  todoCompletedHandler() {
    this.showPopup = false;
  }


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
      displayValue: this.formatBib(entry, Number.MAX_VALUE),
      type: ReferenceType.reference,
      href: "#ref-" + entry.citationKey,
      index: Number.MAX_VALUE,
      isUsed: false
    });
  }

  render() {
    console.warn(this.ranking);
    return <div>
      <div class="vertical">
        <h1>Bibliography</h1>
        <span id="export" onClick={() => this.showPopup = true}>Export</span>
      </div>
      {this.showPopup ? <md-bib-export-popup bib={this.items}></md-bib-export-popup> : ""}

      {this.items.sort((a, b) => {
        var ranka = this.ranking[a.citationKey] || (Number.MAX_VALUE - this.items.indexOf(a));
        var rankb = this.ranking[b.citationKey] || (Number.MAX_VALUE - this.items.indexOf(b));
        return ranka - rankb;
      }).map((i, index) => <md-bib-item name={this.formatBib(i, index+1)} bibitem={i}></md-bib-item>)}
    </div>;
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
