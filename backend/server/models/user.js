const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const minimumPasswordLength = 6;
const saltRounds = 10;

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        validate: {
            validator: username => UserModel.doesNotExist({ username }),
            message: "Username already exists"
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: password => UserModel.minimumLength({ password }),
            message: "Password needs to be 6 characters or more"
        },
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: email => UserModel.doesNotExist({ email }),
            message: "Email already exists"
        },
    },
}, { timestamps: true });

userSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
});

userSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
}

userSchema.statics.minimumLength = function (field) {
    return field.password.length >= minimumPasswordLength;
}

userSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
