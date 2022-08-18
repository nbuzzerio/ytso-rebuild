const {
  Groups,
  algorithm,
  key,
  iv,
} = require("../../../../database/models/groups");

const mongoose = require("mongoose");
const crypto = require("crypto");

describe("groups.generateInviteKey", () => {
  it("should return an encrypted groupid + far future timestamp", () => {
    const id = mongoose.Types.ObjectId();
    const payload = {
      owner_id: id,
      owner_name: "group1_owner",
      name: "group1",
    };

    const group = new Groups(payload);
    const encrypted = group.generateInviteKey();
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    const decryptedPayload = JSON.parse(decrypted);
    expect(encrypted).toBeTruthy();
    expect(decryptedPayload.expiration).toBe("3000-01-01T05:00:00.000Z");
  });

  it("should return an encrypted groupid + 1 hour ahead timestamp", () => {
    const id = mongoose.Types.ObjectId();
    const date = new Date();
    const expirationDate = JSON.parse(
      JSON.stringify(new Date(date.setMinutes(date.getMinutes() + 30)))
    );
    const payload = {
      owner_id: id,
      owner_name: "group1_owner",
      name: "group1",
    };

    const group = new Groups(payload);
    const encrypted = group.generateInviteKey(true);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    const decryptedPayload = JSON.parse(decrypted);
    expect(encrypted).toBeTruthy();
    expect(decryptedPayload.expiration.slice(0, 19)).toBe(
      expirationDate.slice(0, 19)
    );
  });
});
