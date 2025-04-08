import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import morgan from 'morgan';
import databaseConfiguration from './config/dbConfig/databaseConfig.mongodb';
import authRoute from './controller/auth/auth.controller';
import productRoute from './controller/product/product.controller';
import paymentRoute from './controller/payment/payment.controller';
import notFound from './handler/notNotFound/notNotFound.middleware';
import errorHandlerMiddleware from './handler/errorHandler/errorhandler.middleware';
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
}));
app.use(helmet());
app.use(cookieParser());
const PORT: string | number = process.env.PORT as string | number || 8000;
const API_VERSION: string | number = process.env.API_VERSION as string | number || 'v1' as string | number;
const APP_HOST: string = process.env.HOST as string || 'localhost' as string;
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
    console.log(morgan('dev'))
}
app.use(`/api/${API_VERSION}/auth`, authRoute);
app.use(`/api/${API_VERSION}/product`, productRoute);
app.use(`/api/${API_VERSION}/stripe`, paymentRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);
async function startWebServer() {
    try {
        await databaseConfiguration(),
        app.listen(PORT, function() {
            console.log(`Server is running ${APP_HOST} on port ${PORT} on /api/${API_VERSION}/`)
        })
    } catch (error) {
        console.log("Something went wrong")
    }
}
startWebServer();
