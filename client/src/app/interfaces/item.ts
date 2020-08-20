export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    cost: number;
    addedDate: Date;
    expirationDate: Date;
    group: string;
}
