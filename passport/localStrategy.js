const passport = require('passport')
const {Strategy : LocalStrategy} = require('passport-local')
const bcrypt = require('bcrypt')
module.exports = () =>{
    passport.use(new LocalStrategy({
        usenameField: 'email', // req.body.email을 받겠다.
        passwordField: 'password', // req.body.password를 받겠다.
        passReqToCallback: false,
    }), async (email, password, done) =>{ // done(서버실패, 성공유저, 로직실패)
        // 로그인 판단 로직
        try{
            const exUser = await User.fineOne({where : {email}});
            if(exUser){
                // bcrypt 전용 비교 함수가 있습니다.
                const result = await bcrypt.compare(password, exUser.password)
                if(result){
                    done(null, exUser);
                } else{
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '회원가입되지 않은 회원입니다.'} );
            }
        }catch(error){
            console.error(error);

        }
    });
}