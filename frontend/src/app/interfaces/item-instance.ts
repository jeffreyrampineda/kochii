export class ItemInstance {
    id: number;
    name: string;
    quantity: number;
    addedDate: Date;
    expirationDate: Date;
    
    constructor(id, name, quantity, addedDate, expirationDate) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.addedDate = new Date(addedDate);
        this.expirationDate = new Date(expirationDate);
    }

    public checkStatus(): string {
        var today = new Date();
        if(this.expirationDate <= today) {
            return 'Bad';
        }
        return 'Good';
    }
}