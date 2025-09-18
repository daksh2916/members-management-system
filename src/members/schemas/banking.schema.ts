import * as Joi from 'joi';

export const bankingSchema = Joi.object({
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  bankBranch: Joi.string().required(),
  ifscCode: Joi.string().required(),
  chequeAmount: Joi.number().optional(),
  rtgsNumber: Joi.string().optional(),
  chequeNumber: Joi.string().optional(),
});
