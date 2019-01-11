export class MdStyle extends HTMLElement {
    
    connectedCallback() {
        let url = this.getAttribute("url");
        if(url) {
            fetch(url).then(async resp => {
                var css = await resp.text();
                let urlStyle = document.createElement("style");
                urlStyle.innerHTML = css;
                document.head.appendChild(urlStyle);
            })
            return;
        }

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