import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Currency, PaymentStatus } from "../../interfac/payments/stripe.interfac";
import StripePayment from "../../dto/payment/payment.model";
import Stripe from "stripe";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,  {
    apiVersion: '2025-03-31.basil'
})
const createStripePayment = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { amount, currency } = req.body;
        // Log the entire request body for debugging
        console.log('Request Body:', req.body);
        console.log('Amount:', amount);
        console.log("Validating Currency:", currency);
        console.log("Available Currencies:", Object.values(Currency));
        if (typeof amount !== 'number' || !currency || !Object.values(Currency).includes(currency)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "The amount and currency must be provided."});
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card']
        });
        // Store payments to our MongoDB collection
        const payment = new StripePayment({
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: PaymentStatus.SUCCESS,
            lastUpdated: Date.now(),
        });
        await payment.save();
        return res.status(StatusCodes.CREATED).json({
            payment,
            status: PaymentStatus.SUCCESS,
            message: "Payment has been completed successfully.",
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error occurred while processing payment with Stripe:", error);
        // Check if error is an instance of Stripe's APIError
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        // Handle MongoDB errors
        if (error instanceof mongoose.Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error saving payment to database."});
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
};

export {
    createStripePayment
}
