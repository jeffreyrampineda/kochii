const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    const self = this;
    const result = await UserModel.find({ username : self.username });

    if (result.length === 0) {

        // Username doesn't exist.
        next();
    } else {

        // Username exists. Throw error for controller to catch.
        next(new Error("Username already exists"));
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
