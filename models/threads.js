const mongoose = require("../config/config");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const threadSchema = Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        moderator: {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "comments"
            }
        ]
    },
    { timestamps: true }
);

threadSchema.plugin(AutoIncrement, {
    id: "thread_counter",
    inc_field: "id"
});

const Threads = mongoose.model("Threads", threadSchema);

module.exports = Threads;
