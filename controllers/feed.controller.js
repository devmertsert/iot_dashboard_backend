const { validationResult } = require('express-validator');
const FeedService = require('../services/feed.service');

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
        const feed = await FeedService.createFeed(req.user._id, req.body.feedName);

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

module.exports.feeds = async function (req, res) {
    try {
        const feeds = await FeedService.getFeeds(req.user._id);
        if (feeds) {
            if (typeof feeds == 'object' && feeds.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: feeds
                });
            }
            else {
                return res.status(200).json({
                    success: false,
                    errorMessage: 'Oluşturulmuş Feed bulunamadı'
                });
            }
        }
        else {
            return res.status(200).json({
                success: false,
                errorMessage: 'Oluşturulmuş Feed bulunamadı'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message
        });
    }
}