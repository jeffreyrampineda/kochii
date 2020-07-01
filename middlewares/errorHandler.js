module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log(`[ERROR] ${error.status}: ${error.message}`);
        if (error._message) {
            // mongoose error
            ctx.message = "Bad Request";
        } else {
            ctx.status = error.status || 500;
            ctx.message = error.message;
        }
    }
};
