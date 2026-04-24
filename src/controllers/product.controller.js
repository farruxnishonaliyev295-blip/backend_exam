import { Product } from "../models/product.model.js";

const create = async (req, res, next) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      category_id: req.body.category_id,
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res) => {
  const { category_id } = req.query;

  let filter = {};
  if (category_id) filter.category_id = category_id;

  const products = await Product.find(filter).populate("category_id");
  res.json(products);
};

export default { create, getAll };