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

  // static isIn = () => async (req, res, next) => {
  //   const { userId } = req.decoded;
  //   const { workspace_id } = req.query;
  //
  //   if (!workspace_id || !userId)  return Permissions.error(res);
  //
  //   try {
  //     const userWorkspaceCache = await Permissions.getCache(workspace_id, userId);
  //
  //     if (userWorkspaceCache !== null) {
  //       return next();
  //     }
  //   } catch (e) {
  //     console.error(e)
  //   }
  //
  //   const userWorkspace = await Permissions.getUserWorkspace(userId, workspace_id);
  //
  //   if (userWorkspace) {
  //     try {
  //       await Permissions.setCache(workspace_id, userId, userWorkspace.permissions);
  //     } catch (e) {
  //       console.error(e)
  //     }
  //
  //     return next();
  //   }
  //
  //   return Permissions.error(res)
  // };

  static can = (permission) => async (req, res, next) => {
    const { userId } = req.decoded;
    let workspace_id;

    if (permission) {
      workspace_id = req.params.workspace_id;
    } else {
      workspace_id = req.query.workspace_id;
    }

    if (!workspace_id) return Permissions.workspaceIdMissing(res);

    if (!userId)  return Permissions.error(res);

    try {
      const userWorkspaceCache = await Permissions.getCache(workspace_id, userId);

      if (userWorkspaceCache) {
        if (permission && Permissions.check(Number(userWorkspaceCache), permission)) {
          return next();
        }

        return next();
      }
    } catch (e) {
      console.error(e)
    }

    const userWorkspace = await Permissions.getUserWorkspace(userId, workspace_id);

    if (userWorkspace) {
      console.log('userWorkspace', userWorkspace)
      try {
        await Permissions.setCache(workspace_id, userId, userWorkspace.permissions);
      } catch (e) {
        console.error(e)
      }

      if (permission) {
        if (Permissions.check(Number(userWorkspace.permissions), permission)) return next();
      } else {
        return next();
      }
    }

    return Permissions.error(res)
  };

  static getUserWorkspace = async (user_id, workspace_id) => {
    return WorkspaceService.getUserWorkspace({ user_id, workspace_id });
  };
}

export default Permissions;
