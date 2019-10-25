import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator/check';

const createUser = [
  check('login', ACTION_CODES.EMPTY_FIELD_LOGIN)
    .exists()
    .trim()
    .isLength({ min: 3, max: 36 })
    .withMessage('Login invalid'),
  check('email', ACTION_CODES.EMPTY_FIELD_EMAIL)
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(ACTION_CODES.EMAIL_VALIDATION),
  check('password', ACTION_CODES.EMPTY_FIELD_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODES.PASSWORD_VALUE_INVALID)
];

const checkEmail = [
  check('email', ACTION_CODES.EMPTY_FIELD_EMAIL)
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(ACTION_CODES.EMAIL_VALIDATION),
];

export default {
  createUser,
  checkEmail,
};
