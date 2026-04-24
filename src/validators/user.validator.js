import Joi from "joi";

export const UserCreateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email format is invalid",
      "string.empty": "Email is required",
    }),

  role: Joi.string()
    .valid("admin", "user")
    .default("user")
    .messages({
      "any.only": "Role must be admin or user",
    }),

  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base": "Password must contain letters and numbers",
    }),
});