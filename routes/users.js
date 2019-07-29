const express = require("express");
const router = express.Router();
const Controller = require("../controllers/users");
const helper = require("../helpers/index");

router.post("/register", helper.isUserExist, Controller.register);

router.post("/login", Controller.login);

router.get("/logout", Controller.logout);

router.get("/profile", helper.isAuthenticated, Controller.getProfile);

router.get("/:id", Controller.getOneUserById);

router.get("/", Controller.getAllUsers);

router.delete("/:id", helper.isAuthenticated, Controller.deleteOneUserById);

router.put("/:id", helper.isAuthenticated, Controller.updateOneUserById);

module.exports = router;
