import { json, Request, Response } from "express";
import { connection } from "../Db_conncetion/db";
import jwt from 'jsonwebtoken';


class CartService {
    async getAllProductService(res: Response) {
        try {
            const data = connection.query(`select * from product`, (err, result) => {
                if (err) throw err
                return res.status(200).json({
                    status: "Success",
                    data: result
                })
            })
        } catch (error) {
            console.log(error);
        }
    }


    async addCartService(req: Request, res: Response) {
        try {
            const { id, Product_id } = req.params;
            let findproduct = ` select * from cart where product_id = ${(Product_id)}`;
            connection.query(findproduct, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    let updateQunatity = `update cart set quantity= quantity + 1 where product_id = ${Product_id} `;
                    connection.query(updateQunatity, (err, result) => {
                        if (err) throw err
                        return res.status(201).json({
                            status: "Success",
                            Messge: "Product Add Successfully"
                        })
                    });
                }
                else {
                    let addcart = `insert into cart (Product_id,person_id,quantity) values (${Product_id},${id},1)`;
                    connection.query(addcart, (err, result) => {
                        if (err) throw err
                        return res.status(201).json({
                            status: "Success",
                            Messge: "Product Add Successfully"
                        })
                    })
                }
            })
        } catch (error) {
            return error
        }
    }

    async removeCartService(req: Request, res: Response) {
        try {
            const { id, Product_id } = req.params;

            let findMinimunQunatitiy = `select quantity from cart where product_id= ${Product_id}`;
            let updateQunatity = `update cart set quantity= quantity - 1  where product_id = ${Product_id} `;


            connection.query(findMinimunQunatitiy, (err, fields) => {
                if (err) throw err
                const dataField = JSON.parse(JSON.stringify(fields));

                if (dataField[0].quantity > 1) {
                    connection.query(updateQunatity, (err, result) => {
                        if (err) throw err;
                        return res.send(result);
                    });
                } else {
                    connection.query(
                        `DELETE FROM cart WHERE person_id=${id}`,
                        (err, result) => {
                            if (err) throw err;
                            return res.send(JSON.stringify(result));
                        }
                    );
                }
            });
        }
        catch (error: any) {
            return error
        }
    }

    async getProductByUserID(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            let userdata = `select product_id, quantity from cart where person_id=${userId}`
            connection.query(userdata, (err, result) => {
                if (err) throw err
                return res.status(200).json({
                    Status: "Success",
                    data: result
                })
            })

        } catch (error) {
            return (error)
        }
    }
}



export = new CartService()



