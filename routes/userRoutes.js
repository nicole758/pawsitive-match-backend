const express = require('express');
const router = express.Router();
const usersController= require('../controllers/UserContoller');



router.get('/', usersController.index);
router.get('/:id', usersController.getName);
router.post('/create', usersController.create);
router.post('/login', usersController.login);
router.post('/:id/addDog', usersController.addFavoriteDog);
router.get('/:userId/favoriteDogs', usersController.getFavoriteDogs);


module.exports = router;