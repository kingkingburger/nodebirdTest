const express = require('express');
const { renderLogin, createDomain } = require('../controllers');
const { isLoggedIn } = require('../middlwares');

const router = express.Router();

router.get('/', renderLogin);

router.post('/domain', isLoggedIn, createDomain);

module.exports = router;