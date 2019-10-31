import Workspace from '../../controllers/Workspace';
import { checkToken } from '../../middlewares/jwt';
import Permissions from '../../middlewares/permissions';
import Validation from './validation/workspace';

const router = require('express').Router();

router.get('/', checkToken, Workspace.getWorkspaceList);
router.get('/:workspace_id', checkToken, Workspace.getSingleWorkspace);
router.post('/:workspace/archived', checkToken, Workspace.archivedWorkspace);
router.patch('/:workspace', checkToken, Workspace.editWorkspace);

router.post('/:workspace_id/invite',
	checkToken,
	Permissions.can(Permissions.PermissionList.workspace_invite_users),
	Validation.userInvite,
	Workspace.inviteUser
);
router.post('/:workspace_id/invite/confirm', checkToken, Workspace.userInviteConfirmation);
router.delete('/:workspace_id/kick/:user_id',
	checkToken,
	Permissions.can(Permissions.PermissionList.workspace_kick_users),
	Workspace.kickUser
);
router.post('/:workspace_id/change_permission/:user_id', checkToken, Workspace.changeUserPermission); // todo need rename

export default router;
