const request = require("supertest");
const server = require("../index.js");
const mongoose = require("mongoose");

// Set up database connection before any tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection.db.dropDatabase();
});

// close database and server after all tests are complete
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await server.close();
});

describe("/api route", () => {
  test("GET /api/inventory without token should give Unauthorized", async () => {
    const response = await request(server).get("/api/inventory");

    expect(response.status).toEqual(401);
    expect(response.text).toContain("Unauthorized");
  });
  test("GET /api/groups without token should give Unauthorized", async () => {
    const response = await request(server).get("/api/groups");

    expect(response.status).toEqual(401);
    expect(response.text).toContain("Unauthorized");
  });
  test("GET /api/activities without token should give Unauthorized", async () => {
    const response = await request(server).get("/api/activities");

    expect(response.status).toEqual(401);
    expect(response.text).toContain("Unauthorized");
  });
});

describe("/api authentication route", () => {
  const correct_account = {
    username: "correct_username",
    password: "correct_password",
    email: "correct_email@correct.com",
    firstName: "correctFirstName",
    lastName: "correctLastName",
  };

  test("POST /register with correct data should give 202 status /w token", async () => {
    const response = await request(server)
      .post("/register")
      .send(correct_account);

    expect(response.status).toEqual(202);
    expect(response.text).toContain("token");
  });
  test("POST /login with correct data should give 202 status /w token", async () => {
    const response = await request(server).post("/login").send(correct_account);

    expect(response.status).toEqual(202);
    expect(response.text).toContain("token");
  });
  test("POST /login with incorrect auth should give 401 status", async () => {
    const incorrect_account = {
      username: "incorrect_username",
      password: "incorrect_password",
    };

    const response = await request(server)
      .post("/login")
      .send(incorrect_account);

    expect(response.status).toEqual(401);
    expect(response.text).toContain("Authentication failed");
  });
});
