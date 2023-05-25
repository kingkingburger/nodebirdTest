const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

exports.join = async (req, res, next) => {
    const {nick, email, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}})
        if (exUser) {
            return res.redirect('/join?error=exist'); // 이미 존재하는 유저라고 경고뜸
        }
        const hash = await bcrypt.hash(password, 12); //암호화

        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/') // state: 302
    } catch (error) {
        console.error(error);
        next(error);
    }
}


exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?error=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

// app.use(passport.authenticate('kakao'));
// app.use((req,res,next) => passport.authenticate('kakao'))(req,res,next);

exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
}