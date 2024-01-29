const mongoose = require("mongoose");
const debug = require("debug")("kochii:database");

const connectionString = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connection.on("error", () => debug("Connection failed."));
mongoose.connection.once("open", () => debug("Connection established."));

exports.init = async function () {
  try {
    debug("Connecting...");
    await mongoose.connect(connectionString);
  } catch (error) {
    debug(error);
  }
};
