const mqtt = require('mqtt');
const User = require('./models/user.model');
const Feed = require('./models/feed.model');
const FeedData = require('./models/feedData.model');
const UserService = require('./services/user.service');
const FeedService = require('./services/feed.service');

let SOCKET_CONNECTIONS = {};

module.exports.SOCKET_CONNECTIONS = SOCKET_CONNECTIONS;

module.exports.createMqttClient = function (userId, accessId) {

    const client = mqtt.connect(process.env.MQTT_URL);

    client.on('connect', () => {
        client.subscribe(accessId + '/#');
    });

    client.on('message', async (topic, payload) => {
        var parsedTopic = topic.toString().split('/');
        /*
            eğer subscribe olduğumuz accessId ile gelidiyse(topic) buraya girer aksi halde girmez
            girince
                accessId/feedName
            yapısına uygunmu diye kontrol ediyoruz
                '/' ile ayırdığımız stirng için 2. elemana(parsedTopic[1]) a bakıyoruz eğer varsa devam ediyoruz
                yoksa geçersiz topic sayıp işlem yapmıyoruz
        */
        if (parsedTopic[1]) {
            try {
                // gelen payload ı string e çeviriyoruz (sanırım tipi buffer dı, o yüzden çeviriyoruz)
                var payloadToJSON = payload.toString();
                /*
                    parsedTopic içerisinde ilk eleman accessId olarak kabul edip devamına bakıyoruz
                    ve devamında başka '/' işareti varsa dikakte almayıp tümünü(accessId hariç) alıp işlem için
                    kullanıyoruz (feedName olarak)
                */
                var parsedTopicWithoutAccessId = topic.toString().substring(topic.indexOf('/') + 1, topic.toString().length);
                const feeddata = await FeedService.checkPayloadAndCreateFeedData(parsedTopic[0], parsedTopicWithoutAccessId, payloadToJSON);
                console.log(feeddata);
            } catch (error) {
                console.log(error.message);
            }
        }
        else {
            console.log('geçersiz topic');
        }

    });

    SOCKET_CONNECTIONS[userId] = client;

}

module.exports.createMqttClientToRestart = async function () {

    try {
        const users = await User.find();
        for (var i in users) {
            this.createMqttClient(users[i]._id, users[i].accessId);
        }
    } catch (err) {
        console.log('Failed to createMqttClientToRestart');
        console.log(err);
        return;
    }

}