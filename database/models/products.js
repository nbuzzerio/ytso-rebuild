const Joi = require("joi");
const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  sku: { type: Number, required: true, minlength: 1, maxlength: 999999 },
  stock: { type: Number, required: true, minlength: 1, maxlength: 99999 },
});

const Products = mongoose.model("products", productsSchema);

function validate(products) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    sku: Joi.number().min(1).max(999999).required(),
    stock: Joi.number().min(1).max(99999).required(),
  });

  return schema.validate(products);
}

exports.Products = Products;
exports.validate = validate;
