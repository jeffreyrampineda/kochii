const mongoose = require("mongoose");

mongoose.connection.on(
  "error",
  console.error.bind(console, "mongodb: connection error")
);
mongoose.connection.once("open", () =>
  console.log("mongodb: connection established")
);

exports.init = function () {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
