const UserService = require('../services/user.service');
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

    try {

        // Kullanıcıyı kaydediyoruz
        const user = await UserService.createUser(req.body);

        // Kaydolan kullanıcı için mqtt dinleyici oluşturuyoruz
        mqttConnections.createMqttClient(user._id, user.accessId);

        return res.status(201).json({
            success: true,
            message: user.email
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message
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

    try {
        // Kullanıcıyı veritabanında arıyoruz
        const user = await UserService.getUserByEmail(req.body.email);
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
            _id: user._id
        }, process.env.SECRET_TOKEN);

        var userForm = {
            _id: user._id,
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

    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message
        });
    }

}