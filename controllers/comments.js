const Comment = require("../models/comments");
const Thread = require("../models/threads");

module.exports = {
    createNewComment: async (req, res) => {
        try {
            const newComment = {
                description: req.body.description,
                threadId: req.body.threadId
            };
            const resultComment = await Comment.create(newComment);
            const resultThread = await Thread.findOneAndUpdate(
                { _id: req.body.threadId },
                { $push: { comments: resultComment._id } },
                { new: true }
            );
            res.status(200).send({
                message: "Create comment succes",
                newComment: newComment,
                resultComment: resultComment
            });
        } catch (error) {
            res.status(500).send({
                message: "Create comment fail"
            });
        }
    },
    getAllComment: async (req, res) => {
        try {
            const getComment = await Comment.find();
            res.status(200).send({
                message: "Get All comment succes",
                data: getComment
            });
        } catch (error) {
            res.status(500).send({
                message: "Get all comment error"
            });
        }
    }
};
