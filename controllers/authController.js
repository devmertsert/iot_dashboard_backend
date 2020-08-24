const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mqttConnections = require('../mqttConnections');

module.exports.signup = async function (req, res) {

    // Gelen verinin uygun olup olmadığını, eksik olup olmadığını kontrol ediyoruz
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errorMessage: errors.array()
        });
    }

    // "Kullanıcı kayıtlı mı?" kontrolü
    try {
        const checkUser = await User.findOne({
            email: req.body.email
        });
        if (checkUser) {
            return res.status(500).json({
                success: false,
                errorMessage: 'Bu e-posta ile kayıt yapılmış'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            errorMessage: err
        });
    }

    // Kullanıcıyı kaydediyoruz
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();

        // Kaydolan kullanıcı için mqtt dinleyici oluşturuyoruz
        mqttConnections.createMqttClient(savedUser._id, savedUser.accessId);

        return res.status(201).json({
            success: true,
            message: user.email
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            errorMessage: err
        });
    }
}

module.exports.signin = async function (req, res) {

    // Gelen verinin uygun olup olmadığını, eksik olup olmadığını kontrol ediyoruz
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errorMessage: errors.array()
        });
    }

    // Kullanıcıyı veritabanında arıyoruz
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                errorMessage: 'E-Posta adresi veya şifre hatalı'
            });
        }

        // Şifre kontrolü yapıyoruz
        if (!user.validPassword(req.body.password)) {
            return res.status(400).json({
                success: false,
                errorMessage: 'E-Posta adresi veya şifre hatalı'
            });
        }

        // Son işlem olarak JSONWEBTOKEN ile token oluşturup istemciye gönderiyoruz.
        const token = jwt.sign({
            email: user.email
        }, process.env.SECRET_TOKEN);

        var userForm = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            accessId: user.accessId
        }
        return res.status(200).json({
            success: true,
            token: token,
            user: userForm
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            errorMessage: err
        });
    }

}