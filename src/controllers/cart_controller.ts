import { Request, Response } from "express";
import cartService from "../services/cart_service";


class CartController {
    async getAllProduct(req: Request, res: Response) {
        try {
            await cartService.getAllProductService(res)
        }
        catch (error) {
            return res.send(error)
        }
    }

    async addCart(req: Request, res: Response) {
        try {
            await cartService.addCartService(req, res)
        } catch (error) {
            return res.send(error)
        }
    }

    async removeCart(req: Request, res: Response) {
        try {
            await cartService.removeCartService(req, res)
        } catch (err) {
            return res.send(err)
        }
    };

    async userDataById(req: Request, res: Response) {
        try {
            await cartService.getProductByUserID(req, res)
        } catch (error) {
            return res.send(error)
        }
    }
}


export = new CartController();