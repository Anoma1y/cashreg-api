import {
  redisHSetObjectAsync,
  redisHgetAsync,
  redisDelAsync,
} from '../config/redis';
import ACTION_CODES from '../helpers/actionCodes';
import STATUS_CODES from '../helpers/statusCodes'
import BitwisePermissions from '../helpers/permissions';
import WorkspaceService from '../services/workspace';

class Permissions extends BitwisePermissions {
  static error = res =>
    res.status(STATUS_CODES.FORBIDDEN).send();

  static workspaceIdMissing = res =>
    res.status (STATUS_CODES.NOT_FOUND).json({ action: ACTION_CODES.EMPTY_PARAMS_WORKSPACE_ID });

  static getCache = async (workspace_id, user_id) =>
    redisHgetAsync(`workspace-permissions:${workspace_id}`, user_id.toString());

  static setCache = async (workspace_id, user_id, permNumber) =>
    redisHSetObjectAsync(`workspace-permissions:${workspace_id}`, {
      [user_id]: permNumber,
    });

  static clearAllCacheByWorkspaceId = async (wsid) =>
    redisDelAsync(`workspace:${wsid}`);

  static can = (permission) => async (req, res, next) => {
    const { userId } = req.decoded;
    const { workspace_id } = req.params;

    if (!workspace_id) return Permissions.workspaceIdMissing(res);

    if (!permission || !userId)  return Permissions.error(res);

    try {
      const userWorkspaceCache = await Permissions.getCache(workspace_id, userId);

      if (Permissions.check(Number(userWorkspaceCache), permission)) return next();
      else if (userWorkspaceCache !== null) return Permissions.error(res);
    } catch (e) {
      console.error(e)
    }

    const userWorkspace = await WorkspaceService.getUserWorkspace({
      user_id: userId,
      workspace_id,
    });

    if (userWorkspace) {
      try {
        await Permissions.setCache(workspace_id, userId, userWorkspace.permissions);
      } catch (e) {
        console.error(e)
      }

      if (Permissions.check(Number(userWorkspace.permissions), permission)) return next();
    }

    return Permissions.error(res)
  };
}

export default Permissions;
