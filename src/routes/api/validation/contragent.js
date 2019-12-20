import { ACTION_CODE } from "../../../constants";
import { check } from 'express-validator';
import { checkContragentType } from './utils';

const createContragent = [
  check('title', ACTION_CODE.EMPTY_FIELD_TITLE)
    .exists()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODE.EMPTY_FIELD_TYPE)
    .exists()
    .isNumeric()
		.custom(checkContragentType),
  check('longTitle', ACTION_CODE.EMPTY_FIELD_LONG_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('inn', ACTION_CODE.EMPTY_FIELD_INN)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('kpp', ACTION_CODE.EMPTY_FIELD_KPP)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('payment_info', ACTION_CODE.EMPTY_FIELD_PAYMENT_INFO)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
  check('active', ACTION_CODE.EMPTY_FIELD_IS_ACTIVE)
    .exists()
    .isBoolean(),
  check('description', ACTION_CODE.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
];

const editContragent = [
  check('title', ACTION_CODE.EMPTY_FIELD_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODE.EMPTY_FIELD_TYPE)
    .exists()
    .isNumeric()
		.custom(checkContragentType),
  check('longTitle', ACTION_CODE.EMPTY_FIELD_LONG_TITLE)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('inn', ACTION_CODE.EMPTY_FIELD_INN)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('kpp', ACTION_CODE.EMPTY_FIELD_KPP)
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),
  check('payment_info', ACTION_CODE.EMPTY_FIELD_PAYMENT_INFO)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
  check('active', ACTION_CODE.EMPTY_FIELD_IS_ACTIVE)
    .optional()
    .isBoolean(),
  check('description', ACTION_CODE.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 }),
];

export default {
  createContragent,
  editContragent,
};
