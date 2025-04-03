import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload} from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    id: string;
    userId: string;
    isAdmin: boolean; 
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: {
                id: string;
                isAdmin: boolean;
            };
        }
    }
}

const authToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth"];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;
        req.userId = decoded.userId;
        req.user = { id: req.userId, isAdmin: decoded.isAdmin }; 
        next(); // Proceed to the next middleware 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message:"Access Denied!"});
    }
}

export {
    authToken
}
