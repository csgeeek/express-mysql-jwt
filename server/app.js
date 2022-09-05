const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { deleteToken, verifyToken } = require('./utils/authenticateToken');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// register user
app.post('/register', (request, response) => {
    const { name, email, password } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(name, email, password);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// login user
app.post('/login', (request, response) => {
    const { email, password } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.loginUser(email, password);
    result
        .then(data => response.header('authorization', data['authorization']).json({
            "token": data['authorization']
        }))
        .catch(err => console.log(err));
});

app.post('/logout', deleteToken, (req, res) => {
    res.json({
        message: 'logout successful'
    });
})

// create
app.post('/insert', verifyToken, (request, response) => {
    const { name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read
app.get('/getAll', verifyToken, (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// update
app.patch('/update', verifyToken, (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', verifyToken, (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

app.get('/search/:name', verifyToken, (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));