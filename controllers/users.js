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
    login: (req, res) => {
        try {
            // Check if the email entered has been registered or not, if its not, stop the login (else)
            User.findOne({ email: req.body.email }, async (error, result) => {
                if (error) {
                    res.send(error);
                } else {
                    if (result === null)
                        return res.send("Your email is not registered");

                    // compare the encrypted password to the password in the database
                    const validPassword = await bcrypt.compare(
                        req.body.password,
                        result.password
                    );

                    // Stop the login process if the password doesn't match
                    if (!validPassword) {
                        return res.send("password is not valid");
                    }
                    // give the token if the password correct
                    else {
                        const token = jwt.sign(
                            {
                                id: result.id,
                                email: result.email
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: "7d" }
                        );

                        res.send({
                            message: "You are logged in",
                            token: token,
                            user: result
                        });
                    }
                }
            });
        } catch (error) {
            res.send(error);
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
