const express = require('express');
const router = express.Router();
const favoriteDogsController = require('../controllers/DogController');



router.get('/', favoriteDogsController.index);
router.post('/create', favoriteDogsController.create);


module.exports = router;