import { ACTION_CODE } from "../../../constants";
import { check } from 'express-validator';
import { checkTransactionType, checkCategoryParentId } from './utils';

const createCategory = [
  check('name', ACTION_CODE.EMPTY_FIELD_NAME)
    .exists()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('parent_id', ACTION_CODE.EMPTY_FIELD_PARENT_ID)
    .optional()
    .custom(checkCategoryParentId),
  check('description', ACTION_CODE.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODE.EMPTY_FIELD_TYPE)
    .exists()
    .custom(checkTransactionType)
    .isNumeric(),
];

const editCategory = [
  check('name', ACTION_CODE.EMPTY_FIELD_NAME)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('parent_id', ACTION_CODE.EMPTY_FIELD_PARENT_ID)
    .optional()
    .custom(checkCategoryParentId),
  check('description', ACTION_CODE.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODE.EMPTY_FIELD_TYPE)
    .optional()
    .isNumeric()
    .custom(checkTransactionType),
];

export default {
  createCategory,
  editCategory,
};
