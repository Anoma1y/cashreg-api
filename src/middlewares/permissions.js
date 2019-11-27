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

  static getWorkspaceId = req => req.params.workspace_id || req.query.workspace_id || req.body.workspace_id;

  static can = (permission) => async (req, res, next) => {
    const { userId: user_id } = req.decoded;

    const workspace_id = Permissions.getWorkspaceId(req);

    if (!workspace_id) return Permissions.workspaceIdMissing(res);

    if (!user_id)  return Permissions.error(res);

    try {
      const userWorkspaceCache = await Permissions.getCache(workspace_id, user_id);

      if (userWorkspaceCache) {
        if (permission) {
          if (Permissions.check(Number(userWorkspaceCache), permission)) {
            return next();
          }

          return Permissions.error(res);
        }

        return next();
      }
    } catch (e) {
      console.error(e)
    }

    const userWorkspace = await WorkspaceService.getUserWorkspace({ user_id, workspace_id });
    if (userWorkspace) {
      try {
        await Permissions.setCache(workspace_id, user_id, userWorkspace.permissions);
      } catch (e) {
        console.error(e)
      }

      if (permission) {
        if (Permissions.check(Number(userWorkspace.permissions), permission)) {
          return next();
        }

        return Permissions.error(res);
      }

      return next();
    }

    return Permissions.error(res)
  };
}

export default Permissions;
