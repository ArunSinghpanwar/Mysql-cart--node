import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

class TokenVerify {

    async verfiyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.access_token;
            if (!token) {
                return res.status(401).json("You are not authenticated")
            }
            jwt.verify(token, "sdsdsd", (err: any, result: any) => {
                if (err) {
                    return res.status(403).json("token is not valid")
                }
                next()
            })
        } catch (error) {
            return res.send(error)
        }
    }
}

export = new TokenVerify();
