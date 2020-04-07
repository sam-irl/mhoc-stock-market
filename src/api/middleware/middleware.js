const jwt = require('jsonwebtoken');
const JWT_SECRET = require(path.join(__dirname, '../../../config.json'));

export function isAuthenticated(req, res, next) {
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

export function isAllowed(req, res, next) {

}
