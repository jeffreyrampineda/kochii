const debug = require('debug')('kochii:server-error.middleware');

// Catch 404 error
exports.not_found_handler = function (req, res, next) {
  res.status(404);
  res.render('message', {
    title: 'Page Not Found | Kochii',
    message_title: '( ._.)',
    message_subtitle: '404 Not Found',
    message_description: 'Sorry but the requested page is not found!',
  });
};

// Error handler
exports.error_handler = function (error, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  debug(error);
  // render the error page
  res.status(error.status || 500);
  if (['login', 'signup', 'api'].includes(req.originalUrl.split('/')[1])) {
    res.send(error);
  } else {
    res.render(res.locals.render_view, res.locals.render_data);
  }
};
