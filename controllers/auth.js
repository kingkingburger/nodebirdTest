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

// POST /auth/login
// exports.login = (req, res, next) => {
//     passport.authenticate('local', (authError, user, info) => {
//         // 서버 에러
//         if (authError) {
//             console.error(authError);
//             // 에러처리 미들웨어에서 알아서 하도록 보내기
//             return next(authError);
//         }
//         // 유저 에러
//         if (!user) {
//             // 에러 메세지 띄워주게끔
//             return res.redirect(`/?loginError=${info.message}`);
//         }
//         return req.login(user, (loginError) => {
//             if (loginError) {
//                 console.error(loginError);
//                 return next(loginError);
//             }
//             return req.redirect('/')
//         })
//     })(req, res, next);// 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
// }

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


exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
}