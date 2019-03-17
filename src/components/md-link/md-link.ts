import { LinkSubscriber, Link, ReferenceType, getLinkStorage } from "./md-link-storage";

export class MdLink extends HTMLElement implements LinkSubscriber {
    static get observedAttributes() { return ['name', 'href']; }

    connectedCallback() {
        var reference = document.createElement("a");

        reference.innerText = "NOT CONNECTED";

        this.appendChild(reference);

        this.onReferenceChanged("", {
            type: null,
            isUsed: true,
            href: "",
            reportValue: "Not found",
            index: -1
        });

        getLinkStorage((storage) => {
            storage.subscribe(this.getAttribute("link"), this);
        });
    }

    onReferenceChanged(id: string, link: Link) {
        this.getElementsByTagName("a")[0].innerHTML = link.reportValue;
        this.getElementsByTagName("a")[0].setAttribute('href', link.href);

        let update = false;
        if(!link.isUsed) {
            link.isUsed = true;
            update = true;
        }

        if(link.index === -1 || link.index > this.getIndex()) {
            link.index = this.getIndex();
            update = true;
        }

        if(update) {
            getLinkStorage((storage) => {
                storage.update(id, link);
            });

        }

    }

    getIndex(): number {
        return Array.from(document.getElementsByTagName("md-link")).indexOf(this);
    }
}