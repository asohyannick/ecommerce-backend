import express from 'express';
import { createStripePayment } from '../../service/payment/payment.service';
import { authToken } from '../../middleware/auth/authToken.middleware';
const router =  express.Router();
router.post('/create-payment',
    authToken,
    createStripePayment
);
export default router;
