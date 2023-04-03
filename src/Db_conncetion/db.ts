import mysql from 'mysql';



export const connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "password",
    database: "mysqlcart"

})

try {
    if (connection) {
        console.log("Database is connected ");

    }
} catch (error) {
    console.log(error);
}
