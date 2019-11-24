import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator';
import { checkTransactionType } from './utils';

const createContragent = [
  check('title', ACTION_CODES.EMPTY_FIELD_TITLE)
    .exists()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('longTitle', ACTION_CODES.EMPTY_FIELD_LONG_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('inn', ACTION_CODES.EMPTY_FIELD_INN)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('kpp', ACTION_CODES.EMPTY_FIELD_KPP)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('payment_info', ACTION_CODES.EMPTY_FIELD_PAYMENT_INFO)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
  check('active', ACTION_CODES.EMPTY_FIELD_IS_ACTIVE)
    .exists()
    .isBoolean(),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
];

const editContragent = [
  check('title', ACTION_CODES.EMPTY_FIELD_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('longTitle', ACTION_CODES.EMPTY_FIELD_LONG_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('inn', ACTION_CODES.EMPTY_FIELD_INN)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('kpp', ACTION_CODES.EMPTY_FIELD_KPP)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('payment_info', ACTION_CODES.EMPTY_FIELD_PAYMENT_INFO)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
  check('active', ACTION_CODES.EMPTY_FIELD_IS_ACTIVE)
    .optional()
    .isBoolean(),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
];

export default {
  createContragent,
  editContragent,
};
