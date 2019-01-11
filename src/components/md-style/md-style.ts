export class MdStyle extends HTMLElement {
    
    connectedCallback() {
        let name = this.getAttribute("name");
        document.body.className = name;
        let pageStyle = document.createElement("style");
        let pageMargin = this.getAttribute("margin") || "80px 120px";
        pageStyle.innerHTML = `@page {
            margin: ` + pageMargin + `;
        }`
        document.head.appendChild(pageStyle);

    }
}