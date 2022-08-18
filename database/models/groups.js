const Joi = require("joi");
const mongoose = require("mongoose");
const crypto = require("crypto");

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const algorithm = "aes256";

const groupsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner_name: { type: String, required: true },
  members: [
    {
      member_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      member_name: { type: String, required: true },
      isAdmin: { type: Boolean },
    },
  ],
});

groupsSchema.methods.generateInviteKey = function (temp) {
  let timestamp = new Date();
  let expiration = temp
    ? new Date(timestamp.setMinutes(timestamp.getMinutes() + 30))
    : new Date(3000, 0, 1);

  const text = JSON.stringify({
    id: this._id,
    expiration,
  });
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");

  return encrypted;
};

const Groups = mongoose.model("groups", groupsSchema);

function validate(groups) {
  const schema = Joi.object({
    owner_id: Joi.objectId().required(),
    owner_name: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(groups);
}

exports.Groups = Groups;
exports.validate = validate;
exports.key = key;
exports.iv = iv;
exports.algorithm = algorithm;
