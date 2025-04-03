import { Document } from "mongoose";
export interface authInterfac extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken: string;
}
