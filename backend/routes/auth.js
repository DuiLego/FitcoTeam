let express = require('express');

const auth = require('../middlewares/auth');
const controller = require('../controllers/auth');

let router = express.Router();

router.post('/login', controller.loginAccountValidation, controller.loginAccount);
router.post('/signup', controller.signupAccountValidation, controller.signupAccount);
router.get('/session', auth, controller.getAccount);

module.exports = router;
