import Workspace from '../../controllers/Workspace';
import { checkToken } from '../../middlewares/jwt';
import Permissions from '../../middlewares/permissions';

const router = require('express').Router();

router.get('/', checkToken, Workspace.getWorkspaceList);
router.get('/:workspace_id', checkToken, Workspace.getSingleWorkspace);
router.post('/:workspace/archived', checkToken, Workspace.archivedWorkspace);
router.patch('/:workspace', checkToken, Workspace.editWorkspace);

router.post('/invite', checkToken, Permissions.can('workspace_invite_users'), Workspace.inviteUser);
router.post('/invite/confirm', checkToken, Workspace.userInviteConfirmation);
router.delete('/:workspace_id/kick/:user_id', checkToken, Workspace.kickUser);
router.post('/:workspace_id/change_permission/:user_id', checkToken, Workspace.changeUserPermission); // todo need rename

export default router;
