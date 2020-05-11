if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const server = require('./server/server');
const port = process.env.PORT || 3001;

server.listen(port, () => console.log(`The server is running at http://localhost:${port}/`));

module.exports = server;