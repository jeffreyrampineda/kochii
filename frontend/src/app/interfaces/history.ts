export interface History {
    _id?: string;
    created_at: Date;
    method: string;
    target: string;
    addedDate: Date;
    quantity: number;
    description: string;
}
