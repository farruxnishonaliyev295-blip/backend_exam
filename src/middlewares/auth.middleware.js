import jwt from 'jsonwebtoken';

// Faqat login qilganlar uchun
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Sizda ruxsat yo'q (Token topilmadi)." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token yaroqsiz yoki muddati o'tgan." });
  }
};

// Faqat ma'lum rollar uchun (masalan: Admin)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Sizda bu amalni bajarish uchun huquq yo'q." });
    }
    next();
  };
};

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    next();
  };
};
