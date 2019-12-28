import { Component, Prop, h } from "@stencil/core";
import { ReferenceType } from "../md-link/md-link-files";

@Component({
  tag: "md-toc-item",
  styleUrl: 'md-toc-item.scss'
})
export class TableOfContentsItem {
  @Prop() chapter: string;
  @Prop() name: string = "";
  @Prop() indent: string;
  @Prop() href: string;

  connectedCallback() {
    document.querySelectorAll("md-link-storage").forEach((item) => {
      const storage = item;
      storage.update(this.name, {
        displayValue: "Chapter " + this.chapter,
        type: ReferenceType.chapter,
        href: "#" + this.href,
        isUsed: false,
        index: Number.MAX_VALUE
      });
    });
  }

  render() {
    return <a class={"md-toc-item md-toc-item-indent-" + this.indent} href={"#" + this.href}><span class="md-toc-item-chapter">{this.chapter}</span><span class="md-toc-item-name">{this.name}</span></a>;
  }
}
