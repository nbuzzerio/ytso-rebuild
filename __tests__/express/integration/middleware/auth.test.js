const mongoose = require("mongoose");
const request = require("supertest");
const { Products } = require("../../../../database/models/products");
const { User } = require("../../../../database/models/users");

let server;

describe("auth middleware", () => {
  console.log(
    "\x1b[32m",
    "\x1b[1m",
    "////////////////////////// TEST START //////////////////////////"
  );
  let token;

  beforeEach(async () => {
    server = require("../../../../server/index.test_server");
    await Products.deleteMany({});
  });
  afterEach(async () => {
    server.close();
    await Products.deleteMany({});
  });

  const apiCall = () => {
    return request(server)
      .post("/api/products/")
      .set("x-auth-token", token)
      .send({ name: "product1", sku: 10, stock: 10 });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await apiCall();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "invalid token";
    const res = await apiCall();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await apiCall();

    expect(res.status).toBe(200);
  });
});
