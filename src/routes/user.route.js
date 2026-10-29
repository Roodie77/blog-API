const express = require('express');
const { registerUser, loginUser, uploadProfilePicture } = require('../controllers/user.conroller');
const { validateRegister, validateLogin } = require('../validators/user.validation');

const requireAuth = require('../middlewares/requireAuth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/sign-up', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
 router.put('/profile-picture', requireAuth, upload.uploadProfilePicture, uploadProfilePicture);

module.exports = router;
