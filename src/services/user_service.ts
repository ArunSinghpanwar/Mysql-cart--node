import { json, Request, Response } from "express";
import { connection } from "../Db_conncetion/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { login, Register } from "../interface/interface";



class UserService {
    async createUser(req: Request, res: Response) {
        try {
            const Password = req.body.Password
            const { first_name, Last_name, Age, Gmail }: Register = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password, salt)



            if (!(first_name && Last_name && Age && Gmail && Password)) {

                return res.send("Please fill all the fields");
            }

            const findOldUser = `select * from USER_INFO where GMAIL="${Gmail}"`;

            connection.query(findOldUser, (err: any, result: any) => {
                if (err) {
                    return res.send(err);
                }
                if (result.length > 0) {
                    return res.status(403).json({
                        Status: "Fail",
                        Message: "User Already exists",
                    });
                } else {
                    const newUser = `insert into USER_INFO(first_name, Last_name, Age, Gmail,Password)values("${first_name}","${Last_name}",${Age},"${Gmail}","${(hash)}")`;
                    connection.query(newUser, [first_name, Last_name, Age, Gmail, Password],
                        (err) => {
                            if (!err) {
                                return res.status(200).json({
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


    async loginUserService(req: Request, res: Response) {
        try {
            const Password = req.body.Password
            const Gmail: login = req.body.Gmail;
            // const verifyUser= `select * from USER_INFO`
            // const token = jwt.sign({ userID:verifyUser }, "the-super-strong-secrect", { expiresIn: '1h' });
            if (!(Gmail && Password)) {
                return res.send("Please fill Gmail and Password");
            }

            const loginuser = `select * from USER_INFO where Gmail = "${Gmail}" and Password = ${Password}`
            const userID = `select id from USER_INFO where Gmail= "${Gmail}"`
            connection.query(`select Password from USER_INFO where Gmail= "${Gmail}"`, (err, result) => {
                if (err) {
                    throw err
                }
                const userEncryptedPassword = JSON.parse(JSON.stringify(result[0]))
                console.log(userEncryptedPassword.Password);
                connection.query(userID, (err, fields) => {

                    if (err) {
                        throw err
                    } else {

                        const data = JSON.parse(JSON.stringify(fields));

                        const isPasswordCorrect = bcrypt.compare(Password, userEncryptedPassword.Password)

                        if (!isPasswordCorrect) return res.status(404).json("Wrong password or UserName")

                        const token = jwt.sign({ id: data[0].id, }, "sdsdsd", { expiresIn: '1h' });


                        connection.query(loginuser, (err, result) => {
                            if (!err) {
                                res.cookie("access_token", token, {
                                    httpOnly: true
                                })
                                    .status(200).json({

                                        UserID: data[0].id,

                                        Status: "Sucess",

                                        Message: "Welcome to shoping cart",

                                    })

                            }
                            else {
                                console.log(err);

                                return res.status(403)
                                    .json({
                                        Status: "Fail",
                                        Message: "Invalid USERNAME or PASSWORD",
                                    });
                            }
                        });

                    }
                })
            })

        } catch (error) {

            res.send(error);

        }
    }
}


export = new UserService()