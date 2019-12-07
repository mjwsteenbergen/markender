export interface LinkSubscriber {
  onReferenceChanged(id: string, link: Link);
}

export enum ReferenceType {
  reference,
  figure,
  table
}

export class Link {
  displayValue!: string;
  href!: string;
  index: number;
  type: ReferenceType;
  isUsed: boolean;
}
