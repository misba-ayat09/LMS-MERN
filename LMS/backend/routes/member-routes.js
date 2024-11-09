const express = require('express');
const router = express.Router();

const MemberController = require('../controllers/member-controller')

router.post('/signup',MemberController.signup);
router.post('/login',MemberController.login);

module.exports = router;