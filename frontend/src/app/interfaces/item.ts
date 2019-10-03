export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    addedDate: Date;
    expirationDate: Date;
    group: string;
    prevGroup: string;              // used for updating group size
}
