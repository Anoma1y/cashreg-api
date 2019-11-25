import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator';
import { checkTransactionType } from './utils';

const createProject = [
  check('name', ACTION_CODES.EMPTY_FIELD_NAME)
    .exists()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODES.EMPTY_FIELD_TYPE)
    .exists()
    .custom(checkTransactionType)
    .isNumeric(),
];

const editProject = [
  check('name', ACTION_CODES.EMPTY_FIELD_NAME)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('description', ACTION_CODES.EMPTY_FIELD_DESCRIPTION)
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check('type', ACTION_CODES.EMPTY_FIELD_TYPE)
    .optional()
    .isNumeric()
    .custom(checkTransactionType),
];

export default {
  createProject,
  editProject,
};
