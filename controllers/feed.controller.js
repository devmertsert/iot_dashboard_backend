const { validationResult } = require('express-validator');
const FeedService = require('../services/feed.service');
const UserService = require('../services/user.service');

module.exports.createFeed = async function (req, res) {

    // Gelen verinin uygun olup olmadığını, eksik olup olmadığını kontrol ediyoruz
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errorMessage: errors.array()
        });
    }

    try {
        const user = await UserService.getUserByEmail(req.user.email);
        const feed = await FeedService.createFeed(user._id, req.body.feedName);

        return res.status(201).json({
            success: true,
            message: feed.feedName
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message
        });
    }

}