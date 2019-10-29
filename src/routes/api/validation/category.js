import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator/check';
import { checkTransactionType } from './utils';

const createCategory = [
  check('name', ACTION_CODES.EMPTY_FIELD_NAME)
    .exists()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('workspace_id', ACTION_CODES.EMPTY_FIELD_WORKSPACE_ID)
    .exists()
    .isNumeric(),
  check('type', ACTION_CODES.EMPTY_FIELD_TYPE)
    .exists()
    .custom(checkTransactionType)
    .isNumeric(),
];

const editCategory = [
  check('name', ACTION_CODES.EMPTY_FIELD_NAME)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('workspace_id', ACTION_CODES.EMPTY_FIELD_WORKSPACE_ID)
    .optional()
    .isNumeric(),
  check('type', ACTION_CODES.EMPTY_FIELD_TYPE)
    .optional()
    .isNumeric()
    .custom(checkTransactionType),
];

export default {
  createCategory,
  editCategory,
};