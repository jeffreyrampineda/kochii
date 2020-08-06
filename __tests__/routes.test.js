const request = require('supertest');
const server = require('../index.js');
const mongoose = require('mongoose');

// Set up database connection before any tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// close database and server after all tests are complete
afterAll(async () => {
    await mongoose.connection.close()
    await server.close();
});

describe('/api route', () => {
    test('GET /api/inventory without token should give Unauthorized', async () => {
        const response = await request(server).get('/api/inventory');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Unauthorized');
    });
    test('GET /api/groups without token should give Unauthorized', async () => {
        const response = await request(server).get('/api/groups');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Unauthorized');
    });
    test('GET /api/history without token should give Unauthorized', async () => {
        const response = await request(server).get('/api/history');

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Unauthorized');
    });
});

describe('/api authentication route', () => {
    const correct_user = {
        username: "correct_username",
        password: "correct_password",
        email: "correct_email@correct.com"
    }

    test('POST /api/register with correct data should give 202 status /w token', async () => {
        const response = await request(server)
            .post('/api/register')
            .send(correct_user);

        expect(response.status).toEqual(202);
        expect(response.text).toContain('token');
    });
    test('POST /api/login with correct data should give 202 status /w token', async () => {
        const response = await request(server)
            .post('/api/login')
            .send(correct_user);

        expect(response.status).toEqual(202);
        expect(response.text).toContain('token');
    });
    test('POST /api/login with incorrect auth should give 401 status', async () => {
        const incorrect_user = {
            username: "incorrect_usename",
            password: "incorrect_password"
        }

        const response = await request(server)
            .post('/api/login')
            .send(incorrect_user);

        expect(response.status).toEqual(401);
        expect(response.text).toContain('Authentication failed');
    });
});