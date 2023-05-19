const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const nunjucks = require('nunjucks')
const {sequelize} = require('./models');
const passport = require('passport')
const dotenv = require('dotenv')
// process.env.COOKIE_SECRET 없음
dotenv.config() // process.env
// process.env.COOKIE_SECRET 있음
const pageRouter = require('./routes/page')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

const passportConfig = require('./passport')


const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

sequelize.sync( { force: true}) // 개발시에만 true로 하기, 싹다 날아감
    .then(() =>{
        console.log('데이터 베이스 연결 성공');
    })
    .catch((err) =>{
        console.error(err);
    })

app.use(morgan('dev')); // combind로 배포 설정
app.use(express.static(path.join(__dirname, 'public'))); // public 접근할 수 있게
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // 사진폴더 접근할 수 있게
app.use(express.json()); // req.body를 ajax json 요청으로 부터
app.use(express.urlencoded({extended: false})); // req.body 폼을 만듬
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET, // cookieParser와 똑같이 만들기
    cookie: {
        httpOnly: true, // js는 접근 못하게
        secure: false, // 나중에 https 적용할 때 true로 바꾸기
    }
}));

app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 새션 쿠키가 브라우저로 전송



app.use('/',pageRouter);
app.use('/auth',authRouter); // authRouter와 연결
app.use('/post', postRouter) // post를 관리하는 라우터

// 404 NOT FOUND(위에 없는거 여기로 들어옴)
app.use((req,res,next) =>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404;
    next(error);
});

// 404 미들웨어 다음에는 에러처리 미들웨어가 와야 합니다.
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {} // 배포모들일 때, 개발모드일 때 서버는 2가지 옵션을 줍니다.
    res.status(err.status || 500); // 에러 로그를 서비스에게 넘깁니다.
    res.render('error');
});

app.listen(app.get('port'), () =>{
    console.log(app.get('port'), '빈 포트에서 대기 중')
});