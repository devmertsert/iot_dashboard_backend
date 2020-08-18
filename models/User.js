const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 50
    },
    surname: {
        type: String,
        required: true,
        max: 50
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.pre('save', function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.methods.validPassword = function (vPassword) {
    return bcrypt.compareSync(vPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);