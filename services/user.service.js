const User = require('../models/user.model');

/*
    - body:
        name
        surname
        email
        password
    başarılı olursa veritabanına kullanıcıyı kaydedip bu kullanıcıyı geri dönüyor
    aksi takdirde hata fırlatıyor
    ! Kullanıcının veritabanında olup olmadığını kontrol ediyor
        eğer varsa hata mesajı ile hata fırlatıyor
        yoksa kaydı yapıyor
*/
module.exports.createUser = async function (body) {
    try {
        const checkUser = await this.getUserByEmail(body.email);
        if (checkUser) {
            throw new Error('Bu e-posta ile kayıt yapılmış');
        }
        const user = new User({
            name: body.name,
            surname: body.surname,
            email: body.email,
            password: body.password
        });
        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
}

/*
    - email
    başarılı olursa kullanıcıyı geri dönüyor
    aksi takdirde hata fırlatıyor
*/
module.exports.getUserByEmail = async function (email) {
    try {
        const user = await User.findOne({
            email: email
        });
        return user;
    } catch (error) {
        throw error;
    }
}

/*
    - accessId
    başarılı olursa kullanıcıyı geri dönüyor
    aksi takdirde hata fırlatıyor
*/
module.exports.getUserByAccessId = async function (accessId) {
    try {
        const user = await User.findOne({
            accessId: accessId
        });
        return user;
    } catch (error) {
        throw error;
    }
}