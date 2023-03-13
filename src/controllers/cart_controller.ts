import { json, Request, Response } from "express";
import { connection } from "../Db_conncetion/db";
import jwt from 'jsonwebtoken';

class CartController {
    async getAllProduct(req: Request, res: Response) {
        try {
            const showProduct = ` select * from product`;
            connection.query(showProduct, (err, result) => {
                if (err) {
                    return res.send(err);
                }
                console.log(result);
                return res.status(200).json({
                    Status: "Success",
                    data: result,
                });
            });
        } catch (error) {
            return res.send(error)
        }
    };

    async addCart(req: Request, res: Response) {
        try {
            const { id, Product_id } = req.params;
            let findproduct = ` select * from cart where product_id = ${(Product_id)}`;
            connection.query(findproduct, (err, result) => {
                if (err) {
                    return res.send(err);
                }
                if (result.length > 0) {
                    let updateQunatity = `update cart set quantity= quantity + 1 where product_id = ${Product_id} `;
                    connection.query(updateQunatity, (err, result) => {
                        if (err) throw err;
                        return res.send(result);
                    });
                } else {
                    const addcart = `insert into cart (Product_id,person_id,quantity) values (${Product_id},${id},1)`;
                    connection.query(addcart, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.send(err);
                        } else {
                            return res.send(result);
                        }
                    });
                }
            });

        } catch (error) {

            return res.send(error)
        }
    }

    async removeCart(req: Request, res: Response) {
        try {
            if (
                !req.headers.authorization
            ) {
                return res.status(422).json({
                    message: "Please provide the token",
                });
            }


            let theToken = req.headers.authorization;
            jwt.verify(theToken, 'the-super-strong-secrect', (err: any, decode) => {
                if (err) {
                    return res.send(err)
                } else {
                    const { id, Product_id } = req.params;

                    let findMinimunQunatitiy = `select quantity from cart where product_id= ${Product_id}`;
                    let updateQunatity = `update cart set quantity= quantity - 1  where product_id = ${Product_id} `;


                    connection.query(findMinimunQunatitiy, (err, fields) => {
                        if (err) throw err


                        const dataField = JSON.parse(JSON.stringify(fields));
                        // console.log(dataField[0].quantity);

                        if (dataField[0].quantity > 0) {
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
            })



        } catch (err) {
            return res.send(err)

        }
    };

}


export = new CartController();