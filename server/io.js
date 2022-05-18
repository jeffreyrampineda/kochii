const socket = require("socket.io");
const passport_middleware = require("./middlewares/passport.middleware");

let io;

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

exports.init = function (server) {
  io = socket(server, {
    cors: {
      origin: "http://localhost:4200",
    },
  });

  io.use(wrap(passport_middleware.initialize()));
  io.use(wrap(passport_middleware.authenticate("jwt", { session: false })));

  io.on("connection", (socket) => {
    socket.emit("authenticated");
    console.log("socket: connection authenticated");

    // For multiple connections/logins in one account.
    socket.join(socket.request.user.toString());

    socket.on("disconnect", () => {
      console.log("socket: connection closed");
    });
  });
};

exports.room = function (room_name) {
  return io.to(room_name);
};
