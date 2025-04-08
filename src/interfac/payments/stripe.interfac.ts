import { Document } from 'mongoose';
export enum Currency {
    AUR = 'aur',
    CAD = 'cad',
    INR = 'inr',
    USD = 'usd',
    EURO = 'eur'
}
export enum PaymentStatus {
    PENDING = 'Pending',
    SUCCESS = 'Success',
    REJECTED = 'Rejected',
};
export interface IStripe extends Document {
    paymentIntentId: string;
    amount: number;
    status: PaymentStatus;
    currency: Currency,
    lastUpdated?: Date;
};
