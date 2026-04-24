import { Category } from "../models/category.model.js";

const create = async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    user_id: req.user.id,
  });

  res.json(category);
};

const getAll = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

export default { create, getAll };