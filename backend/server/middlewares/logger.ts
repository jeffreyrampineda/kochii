export default (format?) => {
    format = format || ':method ":url"';
  
    return async (ctx, next) => {
      const str = format
        .replace(':method', ctx.method)
        .replace(':url', ctx.url);

      console.log(str);
  
      await next();
    };
}