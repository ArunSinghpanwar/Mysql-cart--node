import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { connection } from "../Db_conncetion/db";
import { login, Register } from "../interface/interface";
import bcrypt from 'bcryptjs'
import cookieParser from "cookie-parser";
import user_service from '../services/user_service'




class UserController {
    async createUser(req: Request, res: Response) {
        try {
            await user_service.createUser(req, res)
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    }

    async loginUser(req: Request, res: Response) {

        try {
            await user_service.loginUserService(req, res)
        } catch (error) {
            return res.send(error)
        }
    }
}

export = new UserController();