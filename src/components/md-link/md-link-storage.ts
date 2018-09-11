export class MdLinkStorage extends HTMLElement {
    requesters: HTMLElement[];
    links: { [id: string]: Link; };

    constructor() {
        super();
        this.requesters = [];
        this.links = {};
    }

    connectedCallback() {
        var clone = document.createDocumentFragment();
        this.appendChild(clone);
    }


    subscribe(element: HTMLElement) {
        element.setAttribute("name", "Missing Link");
        this.requesters.push(element);
    }

    componentInitialised() { }

    setLink(id: string, name: string, href: string, linker: HTMLElement) {
        this.links[id] = {
            name: name,
            href: href,
            parent: linker
        };
        this.updateRequesters(id);
    }

    updateRequesters(id: string) {
        var link = this.links[id];
        this.requesters.forEach(i => {
            if (i.getAttribute("link") === id) {
                i.setAttribute("href", link.href);
                i.setAttribute("name", link.name);
                if (link.parent) {
                    link.parent.setAttribute("used", "true");
                }
            }
        });
    }
}

class Link {
    name!: string;
    href!: string;
    parent: HTMLElement | undefined;

}
