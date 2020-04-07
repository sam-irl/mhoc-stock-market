import jwt from 'jsonwebtoken';
const JWT_SECRET = require(path.join(__dirname, '../../../config.json'));

export const isAuthenticated = (req, res, next) => {
    if (req.headers.jwt) {
        jwt.verify(req.token, JWT_SECRET, (err, decoded => {
            if (err) {
                return res.status(401).json({ err: { code: 401, error: 'couldn\'t verify token (please log in)' } });
            }
            req.decoded = decoded;
            next();
        }));
    } else {
        res.status(401).json({ err: { code: 401, error: 'no jwt in header (please log in)' } });
    }
}

export const isAdmin = (req, res, next) => {
    const admins = ['lily-irl']
    if (req.decoded.user in admins) {
        next()
    } else {
        res.status(403).json({ err: { code: 403, error: 'not an administrator' } });
    }
}

export const isAllowed = (req, res, next) => {
    const admins = ['lily-irl']
    if (req.decoded.user in admins || req.decoded.user === req.body.user) {
        next()
    } else {
        res.status(403).json({ err: { code: 403, error: 'not an authorised user' } });
    }
}
