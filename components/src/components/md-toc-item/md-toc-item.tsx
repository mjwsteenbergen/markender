import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "md-toc-item",
  styleUrl: 'md-toc-item.scss'
})
export class TableOfContentsItem {
  @Prop() chapter: string;
  @Prop() name: string = "";
  @Prop() indent: string;

  render() {
    const href = "#" + (this.name).toLowerCase().replace(new RegExp(' ', 'g'), '-');
    return <a class={"md-toc-item md-toc-item-indent-" + this.indent} href={href}><span class="md-toc-item-chapter">{this.chapter}</span><span class="md-toc-item-name">{this.name}</span></a>;
  }
}
