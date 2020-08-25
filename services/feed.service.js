const Feed = require('../models/feed.model');
const FeedData = require('../models/feedData.model');

/*
    - userId
    - feedName
    Kullanıcıya ait bu feedName ile bir Feed oluşturlmuşmu kontrolü yapıp
        eğer oluşturulmuşsa hata mesajı ile hata fırlatıyoruz
        oluşturulmamışsa yeni bir tane oluşturup geri döndürüyoruz
*/
module.exports.createFeed = async function (userId, feedName) {
    try {
        const checkFeed = await this.getFeed(userId, feedName);
        if (checkFeed) {
            throw new Error('Bu feedName ile kullanıcıya ait bir feed oluşturulmuş');
        }
        const feed = new Feed({
            userId: userId,
            feedName: feedName
        });
        const savedFeed = await feed.save();
        return savedFeed;
    } catch (error) {
        throw error;
    }
}

/*
    - userId
    - feedName
    Eğer bu bilgilere uyan bir Feed varsa onu geri döndürüyoruz
*/
module.exports.getFeed = async function (userId, feedName) {
    try {
        const feed = await Feed.findOne({
            userId: userId,
            feedName: feedName
        });
        return feed;
    } catch (error) {
        throw error;
    }
}


/*
*/
module.exports.createFeedData = async function (parentId, clientId, data) {
    try {
        const feeddata = new FeedData({
            parentId: parentId,
            clientId: clientId,
            data: data
        });
        const savedFeedData = await feeddata.save();
    } catch (error) {
        throw error;
    }
}

module.exports.createFeedDataByAccessId = function (accessId, clientId, data) {

}