import { Feedback } from "../models/feedback.model.js";

const create = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({
      message: req.body.message,
      type: req.body.type,
      image: req.file ? req.file.filename : null,
      device_info: req.headers["user-agent"],
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await Feedback.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export default { create, getAll };