import { Document } from 'mongoose';
export enum qualityStatus {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low'
}
export interface productInterfac extends Document {
    name: string;
    price: number;
    description: string;
    imageURLs: string[];
    quantity: number;
    tags: string[];
    country: string;
    brand: string;
    category: string;
    discount: number;
    rating: number;
    duration: number;
    quality: qualityStatus;
    date: Date;
}
