const { User } = require("../../../../database/models/users");
const auth = require("../../../../server/middleware/auth");
const mongoose = require("mongoose");

describe("auth middlware", () => {
  console.log(
    "\x1b[32m",
    "\x1b[1m",
    "////////////////////////// TEST START //////////////////////////"
  );
  it("should populate req.user with the payload of a valid JWT", () => {
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
