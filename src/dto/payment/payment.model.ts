import mongoose, { Schema} from "mongoose";
import { Currency, IStripe, PaymentStatus } from "../../interfac/payments/stripe.interfac";
const paymentSchema: Schema = new Schema<IStripe>({
    paymentIntentId:{
        type: String,
        trim: true,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        trim: true,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    },
    currency:{
        type: String,
        trim: true,
        enum: Object.values(Currency),
        default: Currency.USD,
    },
    lastUpdated:{
       type: Date,
       default: Date.now
    },
}, {timestamps: true});

const StripePayment = mongoose.model<IStripe>('Stripe', paymentSchema);
export default StripePayment;
