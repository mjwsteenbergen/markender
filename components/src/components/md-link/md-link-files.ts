export interface LinkSubscriber {
  onReferenceChanged(id: string, link: Link);
}

export enum ReferenceType {
  reference,
  figure,
  table,
  chapter
}

export class Link {
  displayValue!: string;
  href!: string;
  index: number;
  type: ReferenceType;
  isUsed: boolean;
}
