import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
const  errorHandlerMiddleware = (req: Request, res: Response) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR || 'Some thing went wrong'
    });
};
export default errorHandlerMiddleware;
