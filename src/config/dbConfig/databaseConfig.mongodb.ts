import 'dotenv/config';
import mongoose from 'mongoose';
const MONGODB_URL_CONNECTIONSTRING: string = process.env.MONGODB_URL as string;
const databaseConfiguration =  async() => {
    try {
        await mongoose.connect(MONGODB_URL_CONNECTIONSTRING);
        console.log("Database connection is successful");
    } catch (error) {
        console.log('Some thing went wrong');
    }
}

export default databaseConfiguration;
