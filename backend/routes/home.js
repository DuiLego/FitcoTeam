let express = require('express');

const auth = require('../middlewares/auth');
const controller = require('../controllers/home');

let router = express.Router();

router.post('/edit_profile', auth, controller.editProfileValidation, controller.editProfile);
router.get('/messages', auth, controller.getMessages);

module.exports = router;
