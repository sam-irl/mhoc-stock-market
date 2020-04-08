import jwt from 'jsonwebtoken';
import path from 'path';
const { JWT_SECRET } = require(path.join(__dirname, '../../../config.json'));

export const isAuthenticated = (req, res, next) => {
    if (req.headers.jwt) {
        jwt.verify(req.headers.jwt, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(401).json({ err: { code: 401, error: 'couldn\'t verify token (please log in)' } });
            }
            req.decoded = decoded;
            next();
        });
    } else {
        res.status(401).json({ err: { code: 401, error: 'no jwt in header (please log in)' } });
    }
}

export const isAdmin = (req, res, next) => {
    const admins = ['lily-irl']
    if (admins.includes(req.decoded.user)) {
        next()
    } else {
        res.status(403).json({ err: { code: 403, error: 'not an administrator' } });
    }
}

export const isAllowed = (req, res, next) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not provide a username' } });
    const admins = ['lily-irl'];
    if (admins.includes(req.decoded.user) || req.decoded.user === req.body.user) {
        next()
    } else {
        res.status(403).json({ err: { code: 403, error: 'not an authorised user' } });
    }
}
