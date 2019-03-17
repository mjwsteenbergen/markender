
export class MdLinkStorage extends HTMLElement {
    subscribers: { [id: string]: LinkSubscriber[]; };
    values: { [id: string]: Link; };

    constructor() {
        super();
        this.subscribers = {};
        this.values = {};
    }

    update(id: string, link: Link) {
        this.values[id] = link;
        this.updateLinkSubscribers(id, link);
    }

    updateLinkSubscribers(id: string, link: Link) {
        let requesters = this.getSubscribers(id, this.subscribers);
        requesters.forEach(element => {
            element.onReferenceChanged(id, link);
            // this.updateIndex(id, element.getIndex());
        });
    }

    private subscribeTo<T>(id: string, dict: { [id: string]: T[]; }, element: T) {
        let arr = dict[id];
        if (arr === null || arr === undefined) {
            dict[id] = [];
            arr = dict[id];
        }

        dict[id].push(element);
    }

    private getSubscribers<T>(id: string, dict: { [id: string]: T[]; }) {
        let arr = dict[id];
        if (arr === null || arr === undefined) {
            return  [];
        }

        return dict[id];
    }

    subscribe(id: string, element: LinkSubscriber) {
        let reference = this.values[id];
        this.subscribeTo(id, this.subscribers, element);
    }
}

export interface LinkSubscriber {
    onReferenceChanged(id:string , link: Link);
}

export enum ReferenceType {
    reference,
    figure,
    table
}

export class Link {
    reportValue!: string;
    href!: string;
    index: number;
    type: ReferenceType;
    isUsed: boolean;
}

export function getLinkStorage(func: (storage: MdLinkStorage) => void): any {
    var storage = document.getElementsByTagName("md-link-storage")[0] as MdLinkStorage;
    if (storage.update === undefined) {
        setTimeout(() => {
            this.getLinkStorage(func);
        }, 200);
    } else {
        func(storage);
    }
}
