const express = require('express')
const {renderMain, renderJoin, renderProfile} = require("../controllers/page");
const {isLoggedIn, isNotLoggedIn} = require("../middlwares");
const router = express.Router();

// 밑에서 사용할 수 있는 공통 데이터를 넣어두는 곳
router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

module.exports = router;