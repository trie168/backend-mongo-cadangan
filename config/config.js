require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_CONNECTION = process.env.ATLAS_URI;
mongoose.set("useCreateIndex", true);

mongoose.connect(
    MONGODB_CONNECTION,
    {
        useNewUrlParser: true
    },
    function(err) {
        if (err) {
            return console.log(err);
        }
    }
);

module.exports = mongoose;
