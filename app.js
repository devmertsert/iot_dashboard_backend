const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dotenv = require('dotenv');
const createError = require('http-errors');
const mongoose = require('mongoose');
const mqttConenctions = require('./mqttConnections');
const cors = require('cors');


dotenv.config();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(cors());

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, async (err) => {
    if (err) {
        return console.log("Mongodb connection failed");
    }
    console.log("Connected to Mongodb");
    await mqttConenctions.createMqttClientToRestart();
})

// Routerları ekliyoruz
const authRoute = require('./routes/auth.route');

// Routerları yönlendiriyoruz
app.use('/auth', authRoute);






// 404 ü yakalayıp error handler a yönlendiriyoruz
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    var errorStatus = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        status: errorStatus,
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Listening on *:' + PORT);
});