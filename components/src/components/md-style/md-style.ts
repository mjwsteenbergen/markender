import { Component, Prop } from "@stencil/core";

@Component({
  tag: "md-style"
})
export class MdStyle {
  /**
   * The style it should assume
   */
  @Prop() name: string;

  /**
   * The url of your personal sheet
   */
  @Prop() url: string;

  /**
   * Margin of the printed page
   */
  @Prop() margin: string = "80px 120px";

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
    pageStyle.innerHTML =
      `@page {
            margin: ` +
      this.margin +
      `;
        }`;
    document.head.appendChild(pageStyle);
  }
}
