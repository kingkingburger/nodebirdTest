const express = require('express')
const {renderMain, renderJoin, renderProfile, renderHashtag} = require("../controllers/page");
const {isLoggedIn, isNotLoggedIn} = require("../middlwares");
const router = express.Router();

// 밑에서 사용할 수 있는 공통 데이터를 넣어두는 곳
router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.followerCount || 0;
    res.locals.followingCount = req.user?.Followings?.followingCount || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag); // 해시태그 검색

module.exports = router;