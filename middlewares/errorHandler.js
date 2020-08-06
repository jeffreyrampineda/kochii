const sendfile = require('koa-sendfile');

module.exports = async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404
        if (status === 404) {
            ctx.throw(404)
        }
    } catch (error) {
        console.log(`[ERROR] ${error.status}: ${error.message}`);
        ctx.status = error.status || 500;
        if (ctx.status === 404) {
            switch (ctx.accepts('html', 'json')) {
                case 'html':
                    ctx.type = 'html';
                    await sendfile(ctx, __dirname + '/../public/404.html');
                    break;
                case 'json':
                    ctx.body = {
                        message: 'Page Not Found'
                    };
                    break;
                default:
                    ctx.type = 'text';
                    ctx.body = 'Page Not Found';
            }
        } else {
            ctx.message = error._message ? "Bad Request" : error.message;
        }
    }
};
