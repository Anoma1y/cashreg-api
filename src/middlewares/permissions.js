import STATUS_CODES from '../helpers/statusCodes'
import BitwisePermissions from '../helpers/permissions';
import WorkspaceService from '../services/workspace';

class Permissions extends BitwisePermissions{
  static error = (res) => res.status(STATUS_CODES.FORBIDDEN).send();

  static can = (permission) => async (req, res, next) => {
    if (!permission)  return Permissions.error(res);

    const { userId } = req.decoded;

    const userWorkspace = await WorkspaceService.getUserWorkspaceByUserId(userId);

    if (Permissions.check(Number(userWorkspace.permissions), permission)) return next();

    return Permissions.error(res)
  };
}

export default Permissions;
