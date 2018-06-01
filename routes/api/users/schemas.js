import Joi from 'joi';

export const userJoiSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().required(),
  email: Joi.string().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});
