import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator';

const createUser = [
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
];

const verifyUser = [
  check('token', ACTION_CODES.EMPTY_FIELD_TOKEN)
    .exists()
    .trim(),
  check('token_id', ACTION_CODES.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
];

const resendEmail = [
  check('token_id', ACTION_CODES.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
];

const verifyUserViaKey = [
  check('key', ACTION_CODES.EMPTY_FIELD_KEY)
    .exists()
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage(ACTION_CODES.VERIFY_KEY_LENGTH)
];

const changePassword = [
  check('currentPassword', ACTION_CODES.EMPTY_FIELD_CURRENT_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODES.PASSWORD_VALUE_INVALID),
  check('newPassword', ACTION_CODES.EMPTY_FIELD_NEW_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODES.PASSWORD_VALUE_INVALID),
];

const checkEmail = [
  check('email', ACTION_CODES.EMPTY_FIELD_EMAIL)
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(ACTION_CODES.EMAIL_VALIDATION),
];

const resetPasswordStepTwo = [
  check('token', ACTION_CODES.EMPTY_FIELD_TOKEN)
    .exists()
    .trim()
    .withMessage('Token not found'),
  check('token_id', ACTION_CODES.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
    .withMessage('Token ID not found'),
  check('password', ACTION_CODES.EMPTY_FIELD_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODES.PASSWORD_VALUE_INVALID)
];

export default {
  createUser,
  verifyUser,
  verifyUserViaKey,
  resendEmail,
  changePassword,
  checkEmail,
  resetPasswordStepTwo,
};
