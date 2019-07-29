const User = require("../models/users");
const helpers = require("../helpers/index");

const userControllers = {
    register: async (req, res) => {
        try {
            const { salt, encryptedPassword } = await helpers.encryptPassword(
                req.body.password
            );
            const newUser = {
                fullName: req.body.fullName,
                email: req.body.email,
                salt: salt,
                password: encryptedPassword
            };
            const result = await User.create(newUser);
            res.status(200).send({
                message: "Register succes",
                newUser: {
                    ...result._doc,
                    salt: "HIDDEN",
                    password: "HIDDEN"
                }
            });
        } catch (error) {
            res.status(500).send({
                message: "Register fail"
            });
        }
    },
    login: async (req, res) => {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password
            };
            const foundUser = await User.findOne({ email: user.email });
            if (foundUser) {
                const authenticated = await helpers.comparePassword(
                    user.password,
                    foundUser.populate
                );
                if (authenticated) {
                    const token = await helpers.createToken(foundUser);
                    res.status(200).send({
                        message: "Login succes",
                        token: token,
                        user: {
                            fullName: foundUser.fullName,
                            email: foundUser.email
                        }
                    });
                } else {
                    res.status(500).send({
                        message: "Login fail"
                    });
                }
            } else {
                res.status(500).send({
                    message: "Login fail"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Login error"
            });
        }
    },
    logout: async (req, res) => {
        res.send({
            message: "Logout succes"
        });
    },
    getProfile: async (req, res) => {
        try {
            const token = req.token;
            const decodedUser = req.decoded;
            if (decodedUser.sub) {
                const user = await User.findById(
                    decodedUser.sub,
                    "-password -salt"
                );
                res.status(200).send({
                    message: "Get profile",
                    tokenIsExist: true,
                    decodedUser: decodedUser,
                    userIsFound: Boolean(user),
                    user: user
                });
            } else {
                res.status(500).send({
                    message: "Invalid token"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Get profile fail"
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, "-password -salt");
            res.status(200).send({
                message: "Get all users",
                users: users
            });
        } catch (error) {
            res.status(500).send({
                message: "Get all users fail"
            });
        }
    },
    getOneUserById: async (req, res) => {
        try {
            const user = await User.findOne(
                { id: req.params.id },
                "-password -salt"
            );
            res.status(200).send({
                message: "Get user by id",
                user: user
            });
        } catch (error) {
            res.status(500).send({
                message: "Get user by id fail"
            });
        }
    },
    deleteOneUserById: async (req, res) => {
        try {
            const userFound = await User.findOne({ id: Number(req.params.id) });
            if (userFound) {
                const user = await User.findOneAndRemove(
                    { id: Number(req.params.id) },
                    { select: "-password -salt" }
                );
                res.status(200).send({
                    message: "Delete user by id succes",
                    user: user
                });
            } else {
                res.status(500).send({
                    message: "Delete by id fail"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Delete by id error"
            });
        }
    },
    updateOneUserById: async (req, res) => {
        try {
            const userFound = await User.findOne({ id: Number(req.params.id) });
            if (userFound) {
                const {
                    salt,
                    encryptedPassword
                } = await helpers.encryptPassword(req.body.password);
                const newUser = {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    salt: salt,
                    password: encryptedPassword
                };
                const user = await User.findByIdAndUpdate(
                    { id: Number(req.params.id) },
                    { $set: newUser },
                    { new: true, select: "-password, -salt" }
                );
                res.status(200).send({
                    message: "Update user by id succes",
                    user: user
                });
            } else {
                res.status(500).send({
                    message: "Update user by id fail"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Update by id error"
            });
        }
    }
};

module.exports = userControllers;
