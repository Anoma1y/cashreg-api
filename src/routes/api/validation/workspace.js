import ACTION_CODES from "../../../helpers/actionCodes";
import { check } from 'express-validator';

const userInvite = [
  check('workspace_id', ACTION_CODES.EMPTY_FIELD_WORKSPACE_ID)
    .exists()
    .isNumeric(),
  check('user_id', ACTION_CODES.EMPTY_FIELD_USER_ID)
    .exists()
    .isNumeric(),
  check('permissions')
    .optional()
    .isNumeric(),
];

export default {
  userInvite,
};
