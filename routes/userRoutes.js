const express = require('express');
const router = express.Router();
const usersController= require('../controllers/UserContoller');



router.get('/', usersController.index);
router.post('/create', usersController.create);
router.post('/login', usersController.login);
router.delete('/:userId/favorite-dogs/:dogId', usersController.removeUserFavoriteDog);
router.get('/:userId/favoriteDogs', usersController.getFavoriteDogs);
router.get('/:userId/applications', usersController.listApplications);
router.post('/:userId/applications', usersController.upsertApplication);
router.post('/:id/addDog', usersController.addFavoriteDog);
router.post('/:id/profile', usersController.updateProfile);
router.get('/:id', usersController.getName);


module.exports = router;