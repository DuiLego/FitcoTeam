let express = require('express');

const auth = require('../middlewares/auth');
const controller = require('../controllers/auth');

let router = express.Router();

router.get('/session', auth, controller.getAccount);

module.exports = router;
