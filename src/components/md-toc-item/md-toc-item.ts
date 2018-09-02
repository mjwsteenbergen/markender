export class TableOfContentsItem extends HTMLElement {
    template: string = /* html */ `
    <a class="md-toc-item"><span class="md-toc-item-chapter"></span><span class="md-toc-item-name"></span></div>
    `;

    constructor() {
        super();
        this.addStyle();
    }

    connectedCallback() {
        this.insertAdjacentHTML("afterbegin", this.template);

        this.className = this.className + " md-toc-item-indent-" + this.getAttribute("indent");
        this.children[0].getElementsByClassName("md-toc-item-chapter")[0].innerHTML = this.getAttribute("chapter") || "";
        this.children[0].getElementsByClassName("md-toc-item-name")[0].innerHTML = this.getAttribute("name") || "";
        // this.shadowRoot.children[1].setAttribute("href", "#" + this.getAttribute("chapter").toString().replace(new RegExp('\\.', 'g'), 'dot'));
        this.children[0].setAttribute("href", "#" + (this.getAttribute("name") || "").toLowerCase().replace(new RegExp(' ', 'g'), '-'));

        // document.getElementsByTagName()
    }


    addStyle() {
        var styleTag = document.createElement("style");
        styleTag.innerHTML = /* css */ `
    
        `;

        document.head.appendChild(styleTag);
    }
}