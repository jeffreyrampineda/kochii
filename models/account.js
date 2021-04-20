const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Schema = mongoose.Schema;
const accountSchema = new Schema({
    accountName: {
        type: String,
        required: [true, "Account name is required"],
        minlength: [6, "Account name must have a minimum length of 6"],
        maxlength: [30, "Account name must have a maximum length of 30"],
        validate: [
            {
                validator: accountName => /^[a-zA-Z0-9_-]*$/.test(accountName),
                message: "Account name must contain an alphanumeric, underscore (_), or dash (-)"
            },
            {
                validator: accountName => AccountModel.doesNotExist({ accountName }),
                message: "Account name already exists"
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
                validator: email => AccountModel.doesNotExist({ email }),
                message: "Email already exists"
            }
        ]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: true,
    },
    inventory: {
        type: Schema.Types.ObjectId,
        ref: 'Inventory'
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    }
}, { timestamps: true });

accountSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
});

accountSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
}

accountSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
}

accountSchema.methods.compareTokens = function (token) {
    return this.verificationToken = token;
}

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;
