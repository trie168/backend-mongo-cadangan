const mongoose = require("../config/config");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const commentSchema = Schema({
    description: {
        type: String,
        required: true
    },
    threadId: {
        type: Schema.Types.ObjectId,
        ref: "Threads"
    },
    commentId: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users"
        }
    ]
});

commentSchema.plugin(AutoIncrement, {
    id: "comment_counter",
    inc_field: "id"
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
