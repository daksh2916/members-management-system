
import * as Joi from 'joi';
import { MembershipType } from '@prisma/client';

export const membershipSchema = Joi.object({
  code: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(MembershipType))
    .required(),
  registrationDate: Joi.date().required(),
  validity: Joi.date().required(),
  amount: Joi.number().positive().required(),
});
