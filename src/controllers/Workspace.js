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
    try {
      await checkValidationErrors(req);

      const {
        decoded: {
          userId: user_id,
        }
      } = req;

      const workspaces = await WorkspaceService.getWorkspaceList(user_id, { json: true });

      return res.status(STATUS_CODES.OK).json(workspaces);
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  editWorkspace = async (req, res) => {

  };

  inviteUser = async (req, res) => {
    try {
      await checkValidationErrors(req);

      await WorkspaceService.inviteUser(req.body);

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.USER_INVITED,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  userInviteConfirmation = async (req, res) => {
    try {
      await checkValidationErrors(req);

      await WorkspaceService.confirmInvite(req.body);

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.USER_INVITED,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  archivedWorkspace = async (req, res) => {

  };

  kickUser = async (req, res) => {

  };

  changeUserPermission = async (req, res) => {

  };
}

export default new Workspace();
