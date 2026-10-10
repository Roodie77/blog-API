const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.conroller');
const { validateRegister, validateLogin } = require('../validators/user.validation');

const router = express.Router();

router.post('/sign-up', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
 
module.exports = router;
