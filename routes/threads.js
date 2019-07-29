const express = require("express");
const router = express.Router();
const Controller = require("../controllers/threads");
const helper = require("../helpers/index");

router.get("/", Controller.getAllThreads);

router.post("/", helper.isAuthenticated, Controller.createNewThread);

router.get("/:id", helper.isAuthenticated, Controller.getThreadByThreadId);

router.get("/user/:_id", helper.isAuthenticated, Controller.getThreadByUserId);

router.delete("/:id", helper.isAuthenticated, Controller.deleteOneThreadById);

router.put("/:id", helper.isAuthenticated, Controller.updateThreadById);

module.exports = router;
