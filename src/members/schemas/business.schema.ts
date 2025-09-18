
import * as Joi from 'joi';

export const businessSchema = Joi.object({
  companyName: Joi.string().required(),
  website: Joi.string().uri().optional(),
  category: Joi.string().required(),
  designation: Joi.string().required(),
});
