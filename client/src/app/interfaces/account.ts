export interface Account {
    _id?: string;
    accountName: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified?: boolean;
    token?: string;
}
