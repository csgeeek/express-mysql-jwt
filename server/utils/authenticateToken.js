const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = jwt.sign({
        email: user.email,
    }, process.env.SECRET);
    return accessToken;
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const deleteToken = (req, res, next) => {
    if (req.headers['authorization']) {
        // const token = req.headers['authorization'];
        req.headers['authorization'] = null;
    }
    next();
}


module.exports = {
    createToken,
    verifyToken,
    deleteToken
}