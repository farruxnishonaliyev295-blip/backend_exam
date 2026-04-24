import { Category } from "../models/category.model.js";

const create = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      user_id: req.user.id,
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export default { create, getAll };