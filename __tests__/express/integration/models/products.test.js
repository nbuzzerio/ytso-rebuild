const mongoose = require("mongoose");
const request = require("supertest");
const { Products } = require("../../../../database/models/products");
const { User } = require("../../../../database/models/users");

let server;

describe("api/products", () => {
  beforeEach(async () => {
    server = require("../../../../server/index.test_server");
    await Products.deleteMany({});
  });
  afterEach(async () => {
    server.close();
    await Products.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all products", async () => {
      Products.collection.insertMany([
        { name: "product1", sku: 1999, stock: 10 },
        { name: "product2", sku: 1999, stock: 10 },
      ]);

      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.name === "product1")).toBeTruthy();
      expect(res.body.some((p) => p.name === "product2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a single product if valid id is passed", async () => {
      const product = new Products({ name: "product1", sku: 199, stock: 30 });
      await product.save();

      const res = await request(server).get(`/api/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", product.name);
    });

    it("should return 404 if an invalid id is passed", async () => {
      const res = await request(server).get(`/api/products/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const apiCall = async () => {
      return await request(server)
        .post("/api/products/")
        .set("x-auth-token", token)
        .send({ name, sku: 199, stock: 30 });
    };

    beforeEach(() => {
      name = "product1";
      token = new User().generateAuthToken();
    });

    it("should return a 401 if user is not logged in", async () => {
      token = "";
      const res = await apiCall();

      expect(res.status).toBe(401);
    });

    it("should return a 400 if product is less than 5 characters", async () => {
      name = "123";
      const res = await apiCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe('"name" length must be at least 5 characters long');
    });

    it("should return a 400 if product is more than 50 characters", async () => {
      name = Array(52).join("x");
      const res = await apiCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '"name" length must be less than or equal to 50 characters long'
      );
    });

    it("should save the product if it is valid", async () => {
      await apiCall();
      const product = await Products.find({ name: "product1" });
      expect(product).not.toBe(null);
    });

    it("should return the product if it is valid", async () => {
      const res = await apiCall();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "product1");
    });
  });
});
