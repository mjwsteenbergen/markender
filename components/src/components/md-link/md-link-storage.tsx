import { Component, Method } from "@stencil/core";
import { LinkSubscriber, Link } from "./md-link-files";

@Component({
  tag: "md-link-storage"
})
export class MdLinkStorage {

  subscribers: { [id: string]: LinkSubscriber[]; };
  values: { [id: string]: Link; };

  connectedCallback() {
    this.subscribers = {};
    this.values = {};
  }

  render() {
    return;
  }

  @Method()
  async update(id: string, link: Link) {
    this.values[id] = link;
    console.log("Force update on " + id, link);
    this.updateLinkSubscribers(id, link);
  }

  @Method()
  async updateLinkSubscribers(id: string, link: Link) {
    let requesters = this.getSubscribers(id, this.subscribers);
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
    console.log("Subscribed to " + id, element);
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
}

var linkStorage = document.createElement("md-link-storage");
document.body.appendChild(linkStorage);

// export function getLinkStorage(func: (storage: MdLinkStorage) => void): any {
//     var storage = document.querySelectorAll("md-link-storage")[0] as MdLinkStorage;
//     if (storage.update === undefined) {
//         setTimeout(() => {
//             this.getLinkStorage(func);
//         }, 200);
//     } else {
//         func(storage);
//     }
// }
