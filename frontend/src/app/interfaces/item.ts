export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    quantityType: string;           // Example: 'slices', 'bottles', 'boxes' TODO: Rename to quantityUnit
    addedDate: Date;
    expirationDate: Date;
    group: string;
    prevGroup: string;              // used for updating group size
}
