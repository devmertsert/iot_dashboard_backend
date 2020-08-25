const mqtt = require('mqtt');
const User = require('./models/user.model');
const Feed = require('./models/feed.model');
const FeedData = require('./models/feedData.model');

let SOCKET_CONNECTIONS = {};

module.exports.SOCKET_CONNECTIONS = SOCKET_CONNECTIONS;

module.exports.createMqttClient = function (userId, accessId) {

    const client = mqtt.connect(process.env.MQTT_URL);

    client.on('connect', () => {
        client.subscribe(accessId + '/#');
    });

    client.on('message', async (topic, payload) => {
        var parsedTopic = topic.toString().split('/');
        if (parsedTopic[1]) {
            try {
                const user = await User.findOne({
                    accessId: parsedTopic[0]
                });
                if (user) {
                    const feed = await Feed.findOne({
                        userId: user._id,
                        feedName: topic.toString().substring(topic.indexOf('/') + 1, topic.toString().length)
                    });
                    if (feed) {
                        var payloadToJSON = JSON.parse(payload.toString());
                        const feeddata = new FeedData({
                            parentId: feed.idForChildren,
                            clientId: payloadToJSON.clientId ? payloadToJSON.clientId : ,
                            data: payloadToJSON.data
                        });
                        const savedFeedData = await feeddata.save();
                        console.log(savedFeedData);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log('geçersiz');
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