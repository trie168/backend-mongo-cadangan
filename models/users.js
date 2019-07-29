const mongoose = require("../config/config");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        thread: [
            {
                type: Schema.Types.ObjectId,
                ref: "thread"
            }
        ]
    },
    {
        timestamps: true
    }
);

userSchema.plugin(AutoIncrement, {
    id: "user_counter",
    inc_field: "id"
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
