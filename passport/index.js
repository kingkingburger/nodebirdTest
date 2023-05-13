const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {
    passport.serializeUser((user,done) =>{ // user === exUser
        done(null, user.id);
    })
    // 세션 { 12351356426 : 1}
    //        세션 쿠키 : 로그인한아이디
    passport.deserializeUser((id,done) =>{
        User.findOne({where: {id}})
            .then((user) =>done(null, user))
            .catch(err => done(err));
    })
}