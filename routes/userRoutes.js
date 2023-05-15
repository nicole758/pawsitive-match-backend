const express = require('express');
const router = express.Router();
const usersController= require('../controllers/UserContoller');



router.get('/', usersController.index);
router.post('/create', usersController.create);
router.post('/login', usersController.login);


module.exports = router;