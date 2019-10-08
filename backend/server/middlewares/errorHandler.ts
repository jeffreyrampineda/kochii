export default async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log(`[ERROR] ${error.status}: ${error.message}`);
        ctx.status = error.status || 500;
        ctx.message = error.message;
    }
}
