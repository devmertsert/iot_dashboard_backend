const Feed = require('../models/feed.model');
const FeedData = require('../models/feedData.model');
const UserService = require('../services/user.service');

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
    - parentId
    - clientId
    - data
    bu bilgiler ile bir FeedData oluşturup veritabanına kaydediyor
*/
module.exports.createFeedData = async function (parentId, clientId, data) {
    try {
        const feeddata = new FeedData({
            parentId: parentId,
            clientId: clientId,
            data: data
        });
        const savedFeedData = await feeddata.save();
        return savedFeedData;
    } catch (error) {
        throw error;
    }
}

/*
    - accessId
    - feedName
    - payload
        - clientId
            eğer varsa bunu kullanıyor
            yoksa (kullanıcı adı kullanıcı soyadı #accessId) şeklinde kaydediyor
    payload ı json a çevirmeye çalışıyor çünkü payload sadece json olursa işlem yapıcak şekilde kodlandı
        eğer çeviremezse hata fırlatıyor
        eğer çevirirse içerisinde data özelliği varmı kontrolü yapıyor
            yoksa hata fırlatıyor
            varsa işlemlere devam ediyor
    gelen accessId ile kullancıyı bulup _id sini alıp bu id ve feedName ile Feed i buluyor
    ardından içerisindeki idForChildren ile yeni bir tane FeedData oluşturuyor
    FeedData parametreleri için
    ilk olarak parentId(idForChildren)
    sonra clientId
    son olarak data olarak payloadToJSON içindeki data yı string e çevirip kaydediyoruz
    ve geriye kayıtlı feeddata yı dönüyoruz
*/
module.exports.checkPayloadAndCreateFeedData = async function (accessId, feedName, payload) {
    try {
        var payloadToJSON = JSON.parse(payload);
        if (!payloadToJSON.data) {
            throw new Error('Geçersiz payload');
        }
        const user = await UserService.getUserByAccessId(accessId);
        if (user) {
            const feed = await this.getFeed(user._id, feedName);
            if (feed) {
                var clientId = payloadToJSON.clientId ? JSON.stringify(payloadToJSON.clientId) : (user.name + ' ' + user.surname + ' #' + user.accessId);
                const feeddata = await this.createFeedData(feed.idForChildren, clientId, JSON.stringify(payloadToJSON.data));
                return feeddata;
            }
            else {
                throw new Error('Geçersiz feedName');
            }
        }
        else {
            throw new Error('Geçerli kullanıcı bulunamadı');
        }
    } catch (error) {
        throw error;
    }
}