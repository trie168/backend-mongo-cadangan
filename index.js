require("dotenv").config();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({
        message: "Haloo halooo"
    });
});

const users = require("./routes/users");
app.use("/users", users);

const threads = require("./routes/threads");
app.use("/threads", threads);

const comments = require("./routes/comments");
app.use("/comments", comments);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
