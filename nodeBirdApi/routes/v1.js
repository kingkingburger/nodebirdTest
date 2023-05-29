const express = require('express')
const {verifyToken} = require("../middlwares");
const { createToken, tokenTest} = require('../controllers/v1')

const router = express.Router();


// /v1/token
router.post('/token', createToken); //req.body.clientSecret 에 토큰 주입
router.get('/test', verifyToken, tokenTest);

module.exports = router;