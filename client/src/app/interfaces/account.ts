export interface Account {
    _id?: string;
    accountName: string;
    password: string;
    email: string;
    isVerified?: boolean;
    token?: string;
}
