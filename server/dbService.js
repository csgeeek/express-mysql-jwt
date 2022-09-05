const mysql = require('mysql');
const dotenv = require('dotenv');
const { createToken } = require('./utils/authenticateToken');
let instance = null;
dotenv.config();

// setup user model in mysql


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async registerUser(name, email, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);";

                connection.query(query, [name, email, password], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return {
                "message": "User registered successfully"
            };
        } catch (error) {
            console.log(error);
        }
    }

    async loginUser(email, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE email = ? AND password = ?;";
                connection.query(query, [email, password], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            if (response.length > 0) {
                // create a token
                const accessToken = createToken(response[0]);
                return {
                    "authorization": accessToken
                }
            } else {
                return {
                    "message": "Invalid email or password"
                }
            }
        } catch (error) {
            console.log(error);
            return {
                "message": "User log in failed"
            };
        }
    }


    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";

                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;