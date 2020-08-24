const mqtt = require('mqtt');
const User = require('./models/User');
const Feed = require('./models/Feed');
const FeedData = require('./models/FeedData');

let SOCKET_CONNECTIONS = {};

module.exports.SOCKET_CONNECTIONS = SOCKET_CONNECTIONS;

module.exports.createMqttClient = async function (userId, accessId) {

    const client = mqtt.connect(process.env.MQTT_URL);

    client.on('connect', () => {
        client.subscribe(accessId + '/#');
    });

    client.on('message', (topic, payload) => {
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
                        var feeddataTemp = {};
                        if (payloadToJSON.clientId) {
                            const feeddata = new FeedData({
                                parentId: feed.idForChildren,
                                clientId: payloadToJSON.clientId,
                                data: payloadToJSON.data
                            });
                            feeddataTemp = await feeddata.save();
                        }
                        else {
                            const feeddata = new FeedData({
                                parentId: feed.idForChildren,
                                data: payloadToJSON
                            });
                            feeddataTemp = await feeddata.save();
                        }
                        console.log(feeddataTemp);
                    }
                }
            } catch (error) {
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
            await this.createMqttClient(users[i]._id, users[i].accessId);
        }
    } catch (err) {
        console.log('Failed to createMqttClientToRestart');
        console.log(err);
        return;
    }

}