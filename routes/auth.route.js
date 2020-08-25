const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { check } = require('express-validator');

/*
    - name => min: 3
    - surname => min: 3
    - email
    - password => min: 6 max: 20
*/
router.post('/signup', [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Ad boş olamaz')
        .isLength({ min: 3 })
        .withMessage('Ad en az 3 karakter uzunluğunda olmalıdır'),
    check('surname')
        .not()
        .isEmpty()
        .withMessage('Soyad boş olamaz')
        .isLength({ min: 3 })
        .withMessage('Soyad en az 3 karakter uzunluğunda olmalıdır'),
    check('email', 'E-Posta zorunludur')
        .not()
        .isEmpty()
        .withMessage('E-Posta boş olamaz')
        .isEmail()
        .withMessage('Geçersiz E-Posta adresi'),
    check('password', 'Şifre 6-20 karakter uzunlukta olmalıdır')
        .not()
        .isEmpty()
        .withMessage('Şifre boş olamaz')
        .isLength({ min: 6, max: 20 })
], authController.signup);

/*
    - email
    - password
*/
router.post('/signin', [
    check('email')
        .not()
        .isEmpty()
        .withMessage('E-Posta boş olamaz')
        .isEmail()
        .withMessage('Geçersiz E-Posta adresi'),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Şifre boş olamaz')
], authController.signin);

module.exports = router;