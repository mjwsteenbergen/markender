import { Component, Prop, h, State, Element } from "@stencil/core";
import { MdLinkStorage } from "./md-link-storage";
import { LinkSubscriber, Link, ReferenceType } from "./md-link-files";

@Component({
  tag: "md-link",
  styleUrl: "md-link.scss"
})
export class MdLink implements LinkSubscriber {

  @Prop() name: string;
  @Prop() link: string;
  @Prop() rank: number;

  @State() linkObj: Link;

  @Element() element: HTMLElement;

  async connectedCallback() {
    let storage = document.querySelector("md-link-storage") as unknown as MdLinkStorage;
    await storage.subscribe(this.link, this);
    this.element.classList.add("notfound");
  }

  render() {
    const innerHTML = (this.linkObj && this.linkObj.displayValue) || "LINK NOT FOUND";
    return <a href={(this.linkObj && this.linkObj.href)}>{innerHTML}</a>;
  }

  onReferenceChanged(id: string, link: Link) {
    let update = false;
    let type = ReferenceType[link.type];
    if (!this.element.classList.contains(type)) {
      this.element.classList.add(type)
    }

    this.element.classList.remove("notfound");

    if (!link.isUsed) {
      link.isUsed = true;
      update = true;
    }

    if (link.index === -1 || link.index > this.rank) {
      link.index = this.rank;
      update = true;
    }

    if (update) {
      document.querySelectorAll("md-link-storage").forEach((item) => {
        const storage = item as unknown as MdLinkStorage;
        storage.update(id, link);
      });

    }
    this.linkObj = link;
  }
}

let mdLink_nr = 1;
document.querySelectorAll("md-link").forEach((item) => {
  // item.setAttribute("rank", mdImg_nr.toString());
  let link = item as unknown as MdLink;
  link.rank = mdLink_nr;
  mdLink_nr++;
});
