import DB from '../config/db';
import {
  errorFormatter,
  HttpError,
  setResponseError,
  setResponseErrorValidation,
  checkValidationErrors,
} from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { validationResult } from 'express-validator/check';
import WorkspaceService from '../services/workspace';
import PermissionService from '../services/permission';

class Workspace {
  getSingleWorkspace = async (req, res) => {

  };

  getWorkspaceList = async (req, res) => {

  };

  editWorkspace = async (req, res) => {

  };

  inviteUser = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        decoded: {
          userId: user_id
        },
      } = req;

      await PermissionService.checkPermission(user_id);

      await WorkspaceService.inviteUser(req.body);

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.USER_CREATED
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  userInviteConfirmation = async (req, res) => {

  };

  archivedWorkspace = async (req, res) => {

  };

  kickUser = async (req, res) => {

  };

  changeUserPermission = async (req, res) => {

  };
}

export default new Workspace();
