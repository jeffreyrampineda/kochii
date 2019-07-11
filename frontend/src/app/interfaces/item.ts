export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    quantityType: string;           // Example: 'slices', 'bottles', 'boxes'
    measurementPerQuantity: number;
    measurementType: string;        // Example: 'mg', 'g', 'pieces'
    addedDate: Date;
    expirationDate: Date;
    group: string;
}
