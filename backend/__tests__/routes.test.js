const request = require('supertest');
const server = require('../index.js');
const mongoose = require('mongoose');

// Set up database connection before any tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_local, { useNewUrlParser: true, useUnifiedTopology: true });
});

// close database and server after all tests are complete
afterAll(async () => {
    await mongoose.connection.close()
    await server.close();
});

describe('/api route', () => {
    test('GET /api/inventory without token should give Authentication Error', async () => {
        const response = await request(server).get('/api/inventory');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication Error');
    });
    test('GET /api/groups without token should give Authentication Error', async () => {
        const response = await request(server).get('/api/groups');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication Error');
    });
    test('GET /api/recipes without token should give Authentication Error', async () => {
        const response = await request(server).get('/api/recipes');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication Error');
    });
    test('GET /api/history without token should give Authentication Error', async () => {
        const response = await request(server).get('/api/history');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication Error');
    });
});

describe('/public route', () => {
     test('POST /public/login with correct auth should give 202 status with token object', async () => {
        const user = {
            username: "tester",
            password: "tester"
        }

        const response = await request(server)
            .post('/public/login')
            .send(user);

        expect(response.status).toEqual(202);
        expect(response.text).toContain('token');
    });
    test('POST /public/login with incorrect auth should give 401 status', async () => {
        const user = {
            username: "tester",
            password: "wrong_password"
        }

        const response = await request(server)
            .post('/public/login')
            .send(user);

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication failed');
    });
});
