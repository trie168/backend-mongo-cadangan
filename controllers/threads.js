const Thread = require("../models/threads");
const User = require("../models/users");
const Comment = require("../models/comments");
const helpers = require("../helpers/index");

module.exports = {
    createNewThread: async (req, res) => {
        try {
            const decodedToken = await helpers.verifyToken(req.token);
            const newThread = {
                moderator: decodedToken._id,
                title: req.body.title
            };
            const resultThread = await Thread.create(newThread);
            const resultUser = await User.findOneAndUpdate(
                { _id: decodedToken._id },
                { $push: { threads: resultThread._id } },
                { new: true }
            );
            res.send({
                message: "New thread succes",
                newThread: newThread,
                resultThread: resultThread,
                resultUser: {
                    _id: resultUser._id,
                    id: resultUser.id,
                    fullName: resultUser.fullName,
                    email: resultUser.email
                }
            });
        } catch (error) {
            res.status(500).send({
                message: "New thread fail"
            });
        }
    },
    getAllThreads: async (req, res) => {
        try {
            res.send({
                message: "Get all threads",
                threads: await Thread.find({})
                    .populate("moderator comments", "-password -threads")
                    .sort([["createdAt", "descending"]])
            });
        } catch (error) {
            res.status(500).send({
                message: "Get all threads fail"
            });
        }
    },
    getThreadByThreadId: async (req, res) => {
        try {
            const threadFound = await Thread.findOne({
                id: Number(req.params.id)
            }).populate(
                "moderator comments",
                "-password -threads -createdAt -updatedAt"
            );

            if (threadFound) {
                res.send({
                    message: "Get thread by id succes",
                    threads: threadFound
                });
            } else {
                res.status(500).send({
                    message: "Get thread by id fail"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: `Get thread by id error`
            });
        }
    },
    getThreadByUserId: async (req, res) => {
        try {
            moderator_id = req.params._id;
            const threadFound = await Thread.find({
                moderator: moderator_id
            }).populate(
                "moderator comments",
                "-password -thread -createdAt -updatedAt"
            );
            if (threadFound) {
                res.send({
                    message: "Get thread by id succes",
                    threads: threadFound
                });
            } else {
                res.status(500).send({
                    message: "Get thread by id fail"
                });
            }
        } catch (error) {
            res.send(500).send({
                message: "Get thread by id error"
            });
        }
    },
    deleteOneThreadById: async (req, res) => {
        try {
            const threadFound = await Thread.findOne({
                id: Number(req.params.id)
            });
            if (threadFound) {
                const resultThread = await Thread.findOneAndRemove({
                    id: Number(req.params.id)
                });
                const resultArrayThread = await Comment.remove({
                    threadId: threadFound._id
                });
                res.send({
                    message: "Delete one thread by id succes",
                    thread: resultThread
                });
            } else {
                res.status(500).send({
                    message: "Delete one thread by id fail"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Delete one thread by id error"
            });
        }
    },
    updateThreadById: async (req, res) => {
        try {
            const threadFound = await Thread.findOneAndUpdate(
                { id: req.params.id },
                {
                    $set: {
                        title: req.body.title
                    }
                }
            );

            res.status(200).send({
                message: "Update thread succes",
                data: threadFound
            });
        } catch (error) {
            res.status(500).send({
                message: "Update thread error"
            });
        }
    }
};
