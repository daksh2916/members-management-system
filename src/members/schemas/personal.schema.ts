import * as Joi from 'joi';

export const personalSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().required(),
  pan: Joi.string().alphanum().length(10).optional(),
  aadhar: Joi.string().pattern(/^[0-9]{12}$/).optional(),
  passport: Joi.string().optional(),
  nationality: Joi.string().optional(),
  birthdate: Joi.date().optional(),
  marriageDate: Joi.date().optional(),
  address: Joi.string().optional(),
});
