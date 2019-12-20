import { ACTION_CODE } from "../../../constants";
import { check } from 'express-validator';

const createUser = [
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
];

const verifyUser = [
  check('token', ACTION_CODE.EMPTY_FIELD_TOKEN)
    .exists()
    .trim(),
  check('token_id', ACTION_CODE.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
];

const resendEmail = [
  check('token_id', ACTION_CODE.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
];

const verifyUserViaKey = [
  check('key', ACTION_CODE.EMPTY_FIELD_KEY)
    .exists()
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage(ACTION_CODE.VERIFY_KEY_LENGTH)
];

const changePassword = [
  check('currentPassword', ACTION_CODE.EMPTY_FIELD_CURRENT_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODE.PASSWORD_VALUE_INVALID),
  check('newPassword', ACTION_CODE.EMPTY_FIELD_NEW_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODE.PASSWORD_VALUE_INVALID),
];

const checkEmail = [
  check('email', ACTION_CODE.EMPTY_FIELD_EMAIL)
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(ACTION_CODE.EMAIL_VALIDATION),
];

const resetPasswordStepTwo = [
  check('token', ACTION_CODE.EMPTY_FIELD_TOKEN)
    .exists()
    .trim()
    .withMessage('Token not found'),
  check('token_id', ACTION_CODE.EMPTY_FIELD_TOKEN_ID)
    .exists()
    .trim()
    .isInt()
    .withMessage('Token ID not found'),
  check('password', ACTION_CODE.EMPTY_FIELD_PASSWORD)
    .exists()
    .trim()
    .isLength({ min: 6, max: 36 })
    .withMessage(ACTION_CODE.PASSWORD_VALUE_INVALID)
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
