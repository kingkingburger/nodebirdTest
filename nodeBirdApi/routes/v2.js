const express = require('express')
const {verifyToken, apiLimiter} = require("../middlwares");
const {createToken, tokenTest, getMyPosts, getPostsByHashtag} = require('../controllers/v2')

const router = express.Router();


// /v2/token
router.post('/token', apiLimiter, createToken); //req.body.clientSecret 에 토큰 주입
router.get('/test', verifyToken, apiLimiter, tokenTest);

router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;