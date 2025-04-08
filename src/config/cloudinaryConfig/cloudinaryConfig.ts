import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_kEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
export default cloudinary;
