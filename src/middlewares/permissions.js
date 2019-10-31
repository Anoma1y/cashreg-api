import {
  redisHSetObjectAsync,
  redisHgetAsync,
  redisDelAsync,
} from '../config/redis';
import STATUS_CODES from '../helpers/statusCodes'
import BitwisePermissions from '../helpers/permissions';
import WorkspaceService from '../services/workspace';

class Permissions extends BitwisePermissions {
  static error = (res) => res.status(STATUS_CODES.FORBIDDEN).send();

  static getCache = async (wsid, uid) => {
    return redisHgetAsync(`workspace:${wsid}`, uid.toString())
  };

  static setCache = async (wsid, uid, permNumber) => {
    return redisHSetObjectAsync(`workspace:${wsid}`, {
      [uid]: permNumber,
    });
  };

  static clearAllCacheByWorkspaceId = async (wsid) => {
    return redisDelAsync(`workspace:${wsid}`);
  };

  static can = (permission) => async (req, res, next) => {
    if (!permission)  return Permissions.error(res);

    const { userId } = req.decoded;
    const { workspace_id } = req.body;

    try {
      const userWorkspaceCache = await Permissions.getCache(workspace_id, userId);

      if (Permissions.check(Number(userWorkspaceCache), permission)) return next();
      else return Permissions.error(res);
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
