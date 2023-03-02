import { json, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { connection } from "../Db_conncetion/db";
import { login, Register } from "../interface/interface";



class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const { first_name, Last_name, Age, Gmail, Password }: Register = req.body;

            if (!(first_name && Last_name && Age && Gmail && Password)) {
                return res.send("Please fill all the fields");
            }

            const oldUser = `select * from USER_INFO where GMAIL="${Gmail}"`;

            connection.query(oldUser, (err: any, result: any) => {
                if (err) {
                    return res.send(err);
                }
                if (result.length > 0) {
                    return res.status(403).json({
                        Status: "Fail",
                        Message: "User Already exists",
                    });
                } else {
                    const newUser = `insert into USER_INFO(first_name, Last_name, Age, Gmail,Password)values("${first_name}","${Last_name}",${Age},"${Gmail}",${Password})`;
                    connection.query(
                        newUser,
                        [first_name, Last_name, Age, Gmail, Password],
                        (err) => {
                            if (!err) {
                                return res.status(201).json({
                                    status: "Success",
                                    Message: "User added Successfully",
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                }
            });
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            let { Gmail, Password }: login = req.body;
            const token = jwt.sign({ username: "arun" }, "the-super-strong-secrect", { expiresIn: '1h' });
            if (!(Gmail && Password)) {
                return res.send("Please fill Gmail and Password");
            }

            const loginuser = `select * from USER_INFO where Gmail = "${Gmail}" and Password = ${Password}`
            const userID = `select id from USER_INFO where Gmail= "${Gmail}"`

            connection.query(userID, (err, fields) => {
                if (err) throw err
                const data = JSON.parse(JSON.stringify(fields));
                // console.log(id);

                connection.query(loginuser, (err, result) => {
                    if (!err) {
                        res.status(200).json({
                            UserID: data[0].id,
                            Status: "Sucess",
                            Message: "Welcome to shoping cart",
                            token: token
                        })
                    } else {
                        console.log(err);
                        return res.status(403).json({
                            Status: "Fail",
                            Message: "Invalid USERNAME or PASSWORD",
                        });
                    }
                });


            })

        } catch (error) {
            res.send(error);

        }
    }
}

export = new UserController();