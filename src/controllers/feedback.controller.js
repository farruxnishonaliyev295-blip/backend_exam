import { Feedback } from "../models/feedback.model.js";

const create = async (req, res) => {
  const feedback = await Feedback.create({
    message: req.body.message,
    type: req.body.type,
    image: req.file ? req.file.filename : null,
    device_info: req.headers["user-agent"],
  });

  res.json(feedback);
};

const getAll = async (req, res) => {
  const data = await Feedback.find();
  res.json(data);
};

export default { create, getAll };