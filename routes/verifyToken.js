const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    // Token için header a bakıyoruz eğer varsa iöerisinden token i alıyoruz
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({
        success: false,
        errorMessage: 'Erişim engellendi'
    });

    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            errorMessage: 'Geçersiz anahtar (token)'
        });
    }
}