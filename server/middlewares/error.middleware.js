// Catch 404 error
exports.not_found_handler = function (req, res, next) {
  res.render("message", {
    title: "Page Not Found | Kochii",
    message_title: "( ._.)",
    message_subtitle: "404 Not Found",
    message_description: "Sorry but the requested page is not found!",
  });
};

// Error handler
exports.error_handler = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //console.log(err);
  // render the error page
  res.status(err.status || 500);
  if (["login", "register", "api"].includes(req.originalUrl.split("/")[1])) {
    res.send(err);
  } else {
    res.render("error");
  }
};
