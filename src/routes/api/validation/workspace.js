import { ACTION_CODE } from "../../../constants";
import { check } from 'express-validator';

const userInvite = [
  check('workspace_id', ACTION_CODE.EMPTY_FIELD_WORKSPACE_ID)
    .exists()
    .isNumeric(),
  check('user_id', ACTION_CODE.EMPTY_FIELD_USER_ID)
    .exists()
    .isNumeric(),
  check('permissions')
    .optional()
    .isNumeric(),
];

const inviteConfirm = [
  check('user_id', ACTION_CODE.EMPTY_FIELD_USER_ID)
    .exists()
    .isNumeric(),
  check('code', ACTION_CODE.EMPTY_FIELD_ACTION_CODE)
    .exists()
    .isLength({ min: 10, })
    .isString(),
  check('code_id', ACTION_CODE.EMPTY_FIELD_ACTION_CODE_ID)
    .exists()
    .isNumeric(),
];

export default {
  userInvite,
  inviteConfirm,
};
