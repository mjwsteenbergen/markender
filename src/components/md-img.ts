import { MdLinkStorage } from "./md-link-storage";

export class MdImage extends HTMLElement {
    template: string = /* html */ `
    <div class="wrapper">
        <img/>
        <span class="md-img-desc"></span>
    </div>
    `;

    constructor() {
        super();
        // var shadow = this.attachShadow({mode: 'open'});
        this.addStyle();
    }

    connectedCallback() {
        this.insertAdjacentHTML("afterbegin", this.template);

        var index = 1;
        var usedIndex = -1;
        document.querySelectorAll("md-img").forEach((item) => {
            if (item === this) {
                usedIndex = index;
                return;
            }
            index++;
        });

        var alignment = this.getAttribute("align") || "center";

        var img = this.querySelectorAll("img")[0];
        img.setAttribute("src", this.getAttribute("src") || "");
        img.className = "center";
        var alt = this.querySelectorAll(".md-img-desc")[0];
        var alt_text = this.getAttribute("alt") || "";
        if (alt_text !== "") {
            alt_text = ": " + alt_text;
        }
        alt.innerHTML = "Figure " + usedIndex + alt_text;
        this.className = alignment;

        var id = this.getAttribute("id") || "fig:" + usedIndex;
        this.setAttribute("id", id);
        var outside = this;

        var storage = outside.getLinkStorageOrCreate() as MdLinkStorage;
        this.addImgToLink(storage, id, "Figure " + usedIndex, "#" + id, outside)
    }

    addImgToLink(storage: MdLinkStorage, id: string, name: string, href: string, element: HTMLElement) {
        if (storage.setLink === undefined) {
            setTimeout(() => {
                this.addImgToLink(storage, id, name, href, element);
            }, 200);
        } else {
            storage.setLink(id, name, href, element);
        }
    }

    getLinkStorageOrCreate(): MdLinkStorage {
        var storage = document.getElementsByTagName("md-link-storage");
        if (storage.length > 0) {
            return storage[0] as MdLinkStorage;
        } else {
            var newStorage = document.createElement("md-link-storage") as MdLinkStorage;
            document.body.appendChild(newStorage);
            return newStorage;
        }

    }

    addStyle() {
        var styleTag = document.createElement("style");
        styleTag.innerHTML = /* css */ `
    md-img {
        page-break-inside: avoid;
    }

    img.center {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    md-img div {
	    margin-bottom: 10px;
    }

    
    md-img div span {
        display: block;
        text-align: center;
        margin-top: 5px;
    }

    md-img div img {
        max-width: 100%;
        max-height: 100%;
    }

    md-img[super-small] div img {
        max-height: 40mm; 
        max-width: 75%;
    }

    md-img[small] div img {
        max-height: 74mm; 
        max-width: 75%;
    }

    md-img[medium] div img {
        max-height: 120mm; 
        max-width: 75%;
    }

    ul[collage] md-img {
        align-self: flex-end;
        vertical-align: middle;
        padding-left: 5px;
        padding-right: 5px;
    }

    ul[collage] {
        padding: 0;
        display: flex;
        width: 100%;
        page-break-inside: avoid;
    }

    md-img .wrapper {
        page-break-inside: avoid;
    }

    md-img[full] {
        height: 290mm;        
    }

    md-img[full] div{
        page-break-before: always;
        page-break-after: always;
        display: table-cell;
        vertical-align: middle;
    }
        `;

        document.head.appendChild(styleTag);
    }
}