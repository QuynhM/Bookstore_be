const Joi = require("joi");

const getAllBooksQuerySchema = Joi.object({
  page: Joi.number().integer().default(1),
  limit: Joi.number().integer().default(10),
  author: Joi.string().trim().min(1),
  country: Joi.string().trim().min(1),
  language: Joi.string().trim().min(1),
  title: Joi.string().trim().min(1),
}).options({ abortEarly: false });

const addBookBodySchema = Joi.object({
  author: Joi.string().trim().min(1).required(),
  country: Joi.string().trim().min(1).required(),
  imageLink: Joi.string().trim().min(1).required(),
  language: Joi.string().trim().min(1).required(),
  pages: Joi.number().default(1),
  title: Joi.string().trim().min(1).required(),
  year: Joi.number().default(0),
}).options({ abortEarly: false });

const updateBookBodySchema = Joi.object({
  author: Joi.string().trim().min(1),
  country: Joi.string().trim().min(1),
  imageLink: Joi.string().trim().min(1),
  language: Joi.string().trim().min(1),
  pages: Joi.number().integer().default(1),
  title: Joi.string().trim().min(1),
  year: Joi.number().integer().default(0),
});

module.exports = {
  getAllBooksQuerySchema,
  addBookBodySchema,
  updateBookBodySchema,
};
