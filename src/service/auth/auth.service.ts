import Auth from "../../dto/auth/auth.model";
import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload} from 'jsonwebtoken';
const register = async(req: Request, res: Response) : Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = await Auth.findOne({email});
        if (user) {
            user.refreshToken = '';  // cancel existing refresh token
            user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists"});
        }
        const newUser = new Auth({
            firstName,
            lastName,
            email,
            password,
            isAdmin: true
        })
        await newUser.save();
        const accessToken = jwt.sign({
            id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRET_KEY as string,  {
            expiresIn: '15m'
        });
        const refreshToken = jwt.sign({
            id: newUser._id, isAdmin: newUser.isAdmin,  email: newUser.email
        }, process.env.JWT_SECRET_KEY as string, {expiresIn: '7d'})
        
       res.cookie('auth', refreshToken, {
         secure: process.env.NODE_ENV as string === 'production',
         httpOnly: true,
         maxAge: 900000,
         sameSite: 'strict'
       });
       return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User has been created successfully",
        newUser,
        accessToken,
        refreshToken,
       })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

const login = async(req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        const user = await Auth.findOne({email, isAdmin: true });
        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Invalid Credentials"})
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Credentials"});
        }
        const accessToken = jwt.sign({id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '15m'
        });
        const refreshToken = jwt.sign({id:user._id, email: user.email, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '7d'
        });
        user.refreshToken = refreshToken;
        user.save();
        res.cookie('auth', refreshToken, {
            httpOnly: true,
            maxAge: 90000,
            secure: process.env.NODE_ENV as string === 'production',
            sameSite: 'strict'
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User has been logged in successfully",
            user,
            accessToken,
            refreshToken
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

const refreshAccessToken = async(req: Request, res: Response): Promise<Response> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Refresh Token!"});
  } 
    try {
        const userPayload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string) as JwtPayload;
       const user = await Auth.findById(userPayload.id);
       if (!user || user.refreshToken !== refreshToken) {
         return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid refresh token"})
       }
      const newAccessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "15m"
        });
        return res.status(StatusCodes.OK).json({
            message: "New access token has been retrieved successfully", 
            newAccessToken
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
};

const fetchUsers = async(req: Request, res: Response): Promise<Response> => {
    try {
        const users = await Auth.find();
        return res.status(StatusCodes.OK).json({message: "Users have been fetched successfully", users});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

const fetchUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findById(id);
        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "User has been fetched successfully", user});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

const updateUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findByIdAndUpdate(id, req.body, {new: true});
        if(!user) {
         return res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "User has been updated successfully", user});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

const removeUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findByIdAndDelete(id);
        if(!user) {
         return res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "User has been deleted successfully", user});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
}

export {
    register,
    login,
    refreshAccessToken,
    fetchUsers,
    fetchUser,
    updateUser,
    removeUser
}
