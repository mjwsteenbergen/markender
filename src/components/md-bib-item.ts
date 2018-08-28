import { BibtexEntry } from "./bibtexParse";

export class MdBibItem extends HTMLElement {
    bibitem: BibtexEntry = new BibtexEntry();
    refnumber: number = 0;

    constructor() {
        super();
    }

    public template: string = /* html */`
     <style>
        md-bib-item {
	        display: block;	
        }

        md-bib-item .wrapper {
            display: flex;
        }

        md-bib-item .reference {
            flex-grow: 2;
            margin-left: 3px;
        }
    </style>
    <div class="wrapper">
        <p class="refnumber">

        </p>
        <p class="reference">

        </p>
    </div>
    `;

    connectedCallback() {
        this.insertAdjacentHTML("afterbegin", this.template);

        this.bibitem = JSON.parse(this.getAttribute("bibitem") || "{}");
        this.refnumber = Number.parseInt(this.getAttribute("refnumber") || "0");

        var wrapper = this.children[1];

        wrapper.getElementsByClassName("refnumber")[0].innerHTML = "[" + this.refnumber + "]";
        wrapper.getElementsByClassName("reference")[0].innerHTML = this.formatReference();
        wrapper.id = "bib-item-" + this.refnumber;
    }

    formatReference() {
        switch (this.bibitem.entryType) {
            case "misc":
                return this.getReference([], ["author", "title", "howpublished", "month", "year", "note", "key", "url"]);
            case "article":
                return this.getReference(["author", "title", "journal", "year", "volume"], ["number", "pages", "month", "note", "key", "url"]);
            case "book":
                return this.getReference(["author", "title", "publisher", "year"], ["volume", "number", "series", "address", "edition", "month", "note", "url"]);
            case "unpublished":
                return this.getReference(["author", "title", "note"], ["month", "year", "key", "url"]);
            case "inproceedings":
                return this.getReference(["author", "booktitle", "title", "year"], ["address", "editor", "month", "note", "number", "organization", "pages", "publisher", "series", "volume", "url"]);
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
        switch (entryTag) {
            case "volume": {
                return "vol. " + input;
            }
            case "howpublished": {
                var regex = /\\url{(.+)}/g;
                var output = regex.exec(input);
                if (output !== null) {
                    input = input.replace(output[0], output[1]);
                    return "<a target=\"_blank\" href=" + input + ">View Online</a>";
                }
                return input;
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