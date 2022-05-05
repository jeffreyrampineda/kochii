export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    unit_of_measurement?: string;
    cost: number;
    addedDate: Date;
    expirationDate: Date;
    group: string;
}
