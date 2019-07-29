const router = require("express").Router();
const Controller = require("../controllers/comments");
const helper = require("../helpers/index");

router.post("/", helper.isAuthenticated, Controller.createNewComment);
router.get("/", Controller.getAllComment);

module.exports = router;
