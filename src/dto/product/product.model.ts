import mongoose, { Schema } from "mongoose";
import { productInterfac, qualityStatus } from "../../interfac/product/product.interfac";
const productSchema: Schema = new Schema<productInterfac>({
 name:{
    type: String,
    trim: true,
 },
 description:{
    type: String,
    trim: true,
 },
 price:{
    type: Number,
    default: 10,
 },
 imageURLs:{
    type: [String],
    default: [
        "https://images.meesho.com/images/products/426684433/nw9so_512.webp",
    ],
 },
 quantity:{
    type: Number,
    default: 20,
 },
 tags:{
    type: [String],
    default: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6pUiXCe6PerTHbrzXIAmhKaefJkAUs1tV1A&s"
    ]
 },
 country:{
    type: String,
    trim: true,
 },
 brand:{
    type: String,
    trim: true,
 },
 category:{
    type: String,
    trim: true,
 },
 discount:{
    type: Number,
    default: 20,
 },
 rating:{
    type:Number,
    default: 2,
 },
 duration:{
    type:Number,
    default: 3,
 },
 quality:{
    type: String,
    enum: Object.values(qualityStatus),
    default: qualityStatus.HIGH,
    trim: true,
 },
 date:{
    type: Date,
    default: Date.now,
 },
}, {timestamps: true});
const Product = mongoose.model<productInterfac>('Product', productSchema);
export default Product;
