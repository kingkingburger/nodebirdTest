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

// /auth/kakao
router.get('/kakao', passport.authenticate('kakao')) // 카카오톡 로그인 화면으로 redirect

// 흐름: /auth/kakao => 카카오톡로그인화면 => /auth/kakao/callback

// // /auth/kakao/callback
// router.get('/kakao/callback', passport.authenticate('kakao',{
//     failureRedirect: '/?loggError=카카오로그인 실패',
// }), (req, res) =>{
//     res.redirect('/')
// });

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/'); // 성공 시에는 /로 이동
});

// router.post('/auth/login', passport.authenticate('local', () =>{
//     req.login()
// }));

module.exports = router;