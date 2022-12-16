const mongoose = require("mongoose");
const debug = require("debug")("kochii:server-database");

const connectionString = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connection.on("error", () => debug("Connection established"));
mongoose.connection.once("open", () => debug("Connection established"));

exports.init = function () {
  debug("Connecting...");
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
