const Joi = require("joi");
const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 255 },
    lastName: {
      type: String,
      validate: {
        isAsync: true,
        validator: function (v, callback) {
          setTimeout(() => {
            const result = v && v.length >= 5 && v.length <= 255;
            callback(result);
          }, 5000);
        },
      }, //custom validator example. Remove isAsync and callback arg for sync
    },
    age: Number,
  });
  
  const Example = mongoose.model("example", exampleSchema);

  function validate(example) {
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(225).required(),
      lastName: Joi.string().min(2).max(255).required(),
      age: Joi.number(),
    });
  
    return schema.validate(example);
  }

  exports.Example = Example
  exports.validate = validate