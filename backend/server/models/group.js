const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name must have a minimum length of 1"],
        maxlength: [30, "Name must have a maximum length of 30"],
        validate: {
            validator: name => GroupModel.doesNotExist({ name }),
            message: "Name already exists"
        }
    }
});

groupSchema.pre('deleteOne', function (next) {
    const { name } = this._conditions;

    if (name === 'Default') {
        next(new Error("Cannot remove group"));
    } else {
        next();
    }
});

groupSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
}

const GroupModel = mongoose.model('Group', groupSchema);

module.exports = GroupModel;
