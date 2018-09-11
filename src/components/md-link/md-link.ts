import { MdLinkStorage } from "./md-link-storage";

export class MdLink extends HTMLElement {

    static get observedAttributes() { return ['name', 'href']; }

    connectedCallback() {
        var reference = document.createElement("a");

        reference.innerText = "NOT CONNECTED";

        this.appendChild(reference);

        var storage = this.getLinkStorageOrCreate();
        storage.subscribe(this);
    }

    getLinkStorageOrCreate(): MdLinkStorage {
        var storage = document.getElementsByTagName("md-link-storage");
        if (storage.length > 0) {
            return storage[0] as MdLinkStorage;
        } else {
            throw Error("Link Storage Not Found");
        }

    }

    attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (attr === 'name') {
            this.getElementsByTagName("a")[0].innerHTML = newValue;
        }
        if (attr === 'href') {
            this.getElementsByTagName("a")[0].setAttribute('href', newValue);
        }
    }
}