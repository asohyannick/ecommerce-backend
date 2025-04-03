import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
const notFound = (req: Request, res: Response) => {
   return res.status(StatusCodes.NOT_FOUND).json({
     success: false,
     message: "Route does not exist",
     status: StatusCodes.NOT_FOUND || 404,
   });
} 
export default notFound;
