const mqtt = require('mqtt');
const User = require('./models/User');

let SOCKET_CONNECTIONS = {};

module.exports.SOCKET_CONNECTIONS = SOCKET_CONNECTIONS;

module.exports.createMqttClient = function (userId, accessId) {

    const client = mqtt.connect(process.env.MQTT_URL);

    client.on('connect', () => {
        client.subscribe(accessId + '/#');
    });

    client.on('message', (topic, payload) => {
        try {
            console.log(JSON.parse(payload.toString()));
        } catch (error) {
            console.log(payload.toString());
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