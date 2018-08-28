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
    md-toc-item {
	display: block;	
}

:root {
  --toc-item-indent: 30px;
}

.md-toc-item-chapter {
	padding-left: 10px;
}

.md-toc-item-name {
	padding-left: 5px;
}

.md-toc-item-extra-space {
	padding-left: 10px;
}

.md-toc-item-indent-1 {
	font-weight: bold;
}

.md-toc-item-indent-2 {
	margin-left: var(--toc-item-indent);
}

.md-toc-item-indent-3 {
	margin-left: calc(var(--toc-item-indent)*2);
}

.md-toc-item-indent-4 {
	margin-left: calc(var(--toc-item-indent)*3);
}

.md-toc-item-indent-5 {
	margin-left: calc(var(--toc-item-indent)*4);
}

.md-toc-item-indent-6 {
	margin-left: calc(var(--toc-item-indent)*5);
}

md-toc-item a {
	color: inherit;
	text-decoration: none;
}
md-toc-item a:visited {
	color: black;
}
        `;

        document.head.appendChild(styleTag);
    }
}