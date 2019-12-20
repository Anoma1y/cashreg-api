import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import WorkspaceService from '../services/workspace';

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

      return res.status(HTTP_STATUS.OK).json(workspaces);
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

      return res.status(HTTP_STATUS.OK).json({
        action: ACTION_CODE.USER_INVITED,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  userInviteConfirmation = async (req, res) => {
    try {
      await checkValidationErrors(req);

      await WorkspaceService.confirmInvite(req.body);

      return res.status(HTTP_STATUS.OK).json({
        action: ACTION_CODE.USER_INVITED,
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
