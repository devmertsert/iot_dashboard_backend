const router = require('express').Router();
const feedController = require('../controllers/feed.controller');
const verify = require('./verifyToken');
const { check } = require('express-validator');

/*
    - feedName
*/
router.post('/createFeed', verify, [
    check('feedName')
        .not()
        .isEmpty()
        .withMessage('feedName gereklidir')
        .isString()
        .withMessage('feedName string olmalıdır')
], feedController.createFeed);

module.exports = router;