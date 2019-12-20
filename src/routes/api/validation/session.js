import { ACTION_CODE } from "../../../constants";
import { check } from 'express-validator';

const login = [
  check('email', ACTION_CODE.EMPTY_FIELD_EMAIL)
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(ACTION_CODE.EMAIL_VALIDATION),
  check('password', ACTION_CODE.EMPTY_FIELD_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODE.PASSWORD_VALUE_INVALID)
];

const refreshToken = [
  check('refreshToken', 'refresh token field is empty')
    .exists()
    .trim()
    .withMessage('ERROR'), // todo add refresh token action msg
];

export default {
  login,
  refreshToken,
};
