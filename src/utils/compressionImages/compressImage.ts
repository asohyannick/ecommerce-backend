import sharp from "sharp";
const compressImage = async(buffer: Buffer, format: 'jpeg' | 'png' = 'jpeg'): Promise<Buffer> => {
  const quality: number  = 90;
  try {
        return await sharp(buffer)
        .resize({ width: 800, fit: 'inside' }) // Fit within the specified width
        .toFormat(format, { quality })
        .toBuffer();
    } catch (error) {
        console.error("Error compressing image:", error);
        throw new Error("Image compression failed");
    }

}
export default compressImage;

