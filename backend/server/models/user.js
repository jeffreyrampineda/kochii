const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [6, "Username must have a minimum length of 6"],
        maxlength: [30, "Username must have a maximum length of 30"],
        validate: [
            {
                validator: username => /^[a-zA-Z0-9_-]*$/.test(username),
                message: "Username must contain an alphanumeric, underscore (_), or dash (-)"
            },
            {
                validator: username => UserModel.doesNotExist({ username }),
                message: "Username already exists"
            }
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must have a minimum length of 6"],
        maxlength: [30, "Password must have a maximum length of 30"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [
            {
                validator: email => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email),
                message: "Email is invalid"
            },
            {
                validator: email => UserModel.doesNotExist({ email }),
                message: "Email already exists"
            }
        ]
    }
}, { timestamps: true });

userSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
});

userSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
}

userSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
