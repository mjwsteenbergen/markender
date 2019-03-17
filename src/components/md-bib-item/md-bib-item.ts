import { BibtexEntry } from "../md-bib/bibtexParse";

export class MdBibItem extends HTMLElement {
    bibitem: BibtexEntry = new BibtexEntry();
    refnumber: number = 0;

    static get observedAttributes() { return ['name']; }

    constructor() {
        super();
    }

    public template: string = /* html */`
    <style></style>
    <div class="wrapper">
        <p class="refnumber"></p>
        <p class="citation_key"></p>
        <p class="reference"></p>
    </div>
    `;

    connectedCallback() {
        this.innerHTML = "";
        this.insertAdjacentHTML("afterbegin", this.template);

        this.bibitem = JSON.parse(this.getAttribute("bibitem") || "{}");
        this.refnumber = Number.parseInt(this.getAttribute("refnumber") || "0");

        var wrapper = this.children[1];

        wrapper.getElementsByClassName("refnumber")[0].innerHTML = "[" + this.getAttribute("name") + "]";
        wrapper.getElementsByClassName("citation_key")[0].innerHTML = "[" + this.bibitem.citationKey + "]";
        wrapper.getElementsByClassName("reference")[0].innerHTML = this.formatReference();
        wrapper.id = "ref-" + this.bibitem.citationKey;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        var wrapper = this.children[1];
        switch(name) {
            case "name": 
                if(wrapper === undefined) {
                    return;
                }
                wrapper.getElementsByClassName("refnumber")[0].innerHTML = "[" + newValue + "]";
                break;
        }
    }

    formatReference() {
        switch (this.bibitem.entryType) {
            case "misc":
                return this.getReference([], ["author", "title", "howpublished", "month", "year", "note", "key", "url"]);
            case "article":
                return this.getReference(["author", "title", "journal", "year"], ["volume", "number", "pages", "month", "note", "key", "url"]);
            case "book":
                return this.getReference(["title", "publisher", "year"], ["author", "editor", "volume", "number", "series", "address", "edition", "month", "note", "url"]);
            case "booklet":
                return this.getReference(["title"], ["author", "howpublished", "address", "month", "year", "note", "key", "url"]);
            case "conference":
                return this.getReference(["author", "title", "booktitle", "year"], ["editor", "volume", "number", "series", "pages", "address", "month", "organization", "publisher", "note", "url"]);
            case "inbook":
                return this.getReference(["author", "title", "publisher", "year"], ["chapter", "pages", "volume", "number", "series", "type", "address", "edition", "month", "note"]);
            case "incollection":
                return this.getReference(["author", "title", "booktitle", "publisher", "year"], ["editor", "volume", "number", "series", "type", "chapter", "pages", "address", "edition", "month", "note"]);
            case "inproceedings":
                return this.getReference(["author", "booktitle", "title", "year"], ["address", "editor", "month", "note", "number", "organization", "pages", "publisher", "series", "volume", "url"]);
            case "manual":
                return this.getReference(["title"], ["author", "organization", "address", "edition", "month", "year", "note"]);
            case "mastersthesis":
                return this.getReference(["author", "title", "school", "year"], ["type", "address", "month", "note"]);
            case "phdthesis":
                return this.getReference(["author", "title", "year", "school"], ["address", "month", "keywords", "note"]);
            case "proceedings":
                return this.getReference(["title", "year"], ["editor", "volume", "number", "series", "address", "month", "organization", "publisher", "note"]);
            case "techreport":
                return this.getReference(["author", "title", "institution", "year"], ["type", "number", "address", "month", "note"]);
            case "unpublished":
                return this.getReference(["author", "title", "note"], ["month", "year", "key", "url"]);
            default:
                return "format: " + this.bibitem.entryType + " not recognized.";
        }
    }

    formatMisc() {
        return "misc";
    }

    formatArticle() {

        return "Article";
    }

    getReference(required: string[], optional: string[]) {
        var item = this.bibitem;
        var check = this.checkValid(item, required);
        if (check !== "") {
            return check;
        }
        return this.chain(item, required.concat(optional));
    }

    checkValid(input: BibtexEntry, items: any) {
        var res: string[] = [];
        items.forEach(function (element: string) {
            if (input.entryTags[element] === undefined) {
                res.push(element);
            }
        }, this);
        if (res.length === 0) {
            return "";
        }
        return "<span style='color: red'>required elements " + res.join() + " from " + input["citationKey"] + " were not found </span>";
    }

    chain(input: BibtexEntry, items: any) {
        var res: string[] = [];
        var bib = this;
        items.forEach(function (element: string) {
            if (input.entryTags[element] !== undefined) {
                res.push(bib.formatEntryTag(element, input.entryTags[element] || ""));
            }
        }, this);
        return res.join(", ");
    }

    formatEntryTag(entryTag: string, input: string): string {
        //Replace \url{} with a link
        input = input.replace(/\\url{(.+)}/g, "<a target=\"_blank\" href=$1>View Online</a>");

        //Replace {\textquotesingle} with '
        input = input.replace(/{\\textquotesingle}/g, "'");

        //Replace {ACM} with _ACM_
        input = input.replace(/{ACM}/g, "<span style=\"font-style: italic;\">ACM</span>");
        
        // Remove all other {}
        input = input.replace(/\{(.+?)\}/g, "$1");
        switch (entryTag) {
            case "volume": {
                return "vol. " + input;
            }
            case "url": {
                if (input.startsWith("http")) {
                    return "<a target=\"_blank\" href=" + input + ">View Online</a>";
                }
            }
            default: {
                return input;
            }
        }
    }
}