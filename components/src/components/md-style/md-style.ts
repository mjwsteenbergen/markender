import { Component, Prop } from "@stencil/core";

@Component({
  tag: "md-style"
})
export class MdStyle {
  @Prop() url: string;
  @Prop() name: string;
  @Prop() margin: string;

  connectedCallback() {
    let url = this.url;
    if (url) {
      fetch(url).then(async resp => {
        var css = await resp.text();
        let urlStyle = document.createElement("style");
        urlStyle.innerHTML = css;
        document.head.appendChild(urlStyle);
      });
      return;
    }

    let name = this.name;
    document.body.className = name;
    let pageStyle = document.createElement("style");
    let pageMargin = this.margin || "80px 120px";
    pageStyle.innerHTML =
      `@page {
            margin: ` +
      pageMargin +
      `;
        }`;
    document.head.appendChild(pageStyle);
  }
}
