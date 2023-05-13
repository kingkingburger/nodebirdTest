const express = require('express')
const {isLoggedIn, isNotLoggedIn} = require('../middlwares');
const passport = require('passport');
const { join, login, logout } = require('../controllers/auth')
const router = express.Router();


// POST /auth/join
router.post('/join', isNotLoggedIn, join);
// POST /auth/login
router.post('/login', isNotLoggedIn, login);
// GET /auth/logout
router.get('/logout', isLoggedIn, logout);


router.post('/auth/login', passport.authenticate('local', () =>{
    req.login()
}));

module.exports = router;