import { Component, Method } from "@stencil/core";
import { LinkSubscriber, Link } from "./md-link-files";

@Component({
  tag: "md-link-storage"
})
export class MdLinkStorage {

  subscribers: { [id: string]: LinkSubscriber[]; };
  values: { [id: string]: Link; };
  index: number;

  connectedCallback() {
    this.subscribers = {};
    this.values = {};
    this.index = 0;
  }

  render() {
    return;
  }

  @Method()
  async update(id: string, link: Link) {
    this.values[id] = link;
    this.updateLinkSubscribers(id, link);
  }

  async updateLinkSubscribers(id: string, link: Link) {
    let requesters = this.getSubscribers(id, this.subscribers);
    // console.log("Force update on " + id, link, requesters);
    requesters.forEach(element => {
      element.onReferenceChanged(id, link);
    });
  }

  private subscribeTo<T>(id: string, dict: { [id: string]: T[]; }, element: T) {
    let arr = dict[id];
    if (arr === null || arr === undefined) {
      dict[id] = [];
      arr = dict[id];
    }
    // console.log("Subscribed to " + id, element);
    dict[id].push(element);
  }

  private getSubscribers<T>(id: string, dict: { [id: string]: T[]; }) {
    let arr = dict[id];
    if (arr === null || arr === undefined) {
      return [];
    }

    return dict[id];
  }

  @Method()
  async subscribe(id: string, element: LinkSubscriber) {
    this.subscribeTo(id, this.subscribers, element);
  }

  @Method()
  async getValue(id: string): Promise<Link> {
    return this.values[id];
  }
}

var linkStorage = document.createElement("md-link-storage");
document.body.appendChild(linkStorage);
