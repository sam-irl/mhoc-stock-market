import crypto from 'crypto';
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/reddit', (req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
        state: req.session.state
    })(req, res, next);
});

router.get('/reddit/callback', (req, res, next) => {
    if (req.query.state === req.session.state) {
        passport.authenticate('reddit', {
            successRedirect: '/auth/login/success',
            failureRedirect: '/auth/login'
        })(req, res, next);
    } else {
        const err = new Error('states did not match when handling reddit login');
        err.code = 403;
        next(err);
    }
});

router.get('/login', (req, res) => res.render('login'));

router.get('/login/success', (req, res) => req.redirect('/me/profile'));

export default router;
