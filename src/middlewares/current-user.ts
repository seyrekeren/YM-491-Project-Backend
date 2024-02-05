import {Request, Response, NextFunction} from "express";
import {IUserPayload} from "../types/user-payload";
import {JwtService} from "../services/jwt-service";

export const currentUser = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization; // Veya başka bir yerden token'ı alın
    if (!token) {
        return next();
    }

    try {
        const payload = JwtService.verify(token) as IUserPayload;
        req.currentUser = payload;
    } catch (err) {
        // Hata durumunda istediğiniz işlemleri yapabilirsiniz.
        return res.status(500).json({ message: 'currentUser error' });
    }

    return next();
};