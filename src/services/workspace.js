import DB from '../config/db';
import {
	addTimestamp,
	generateCode,
	hashPassword,
} from '../helpers/index';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import MailService from './mail';
import { ACTION_CODES_EXPIRES, ACTION_CODES_TYPES } from '../config/constants';

class Workspace {
	getUserWorkspace = async (where = {}) => {
		return DB.WorkspaceUsers.findOne({
			where,
			plain: true,
		})
	};

	inviteUser = async (data) => {
		try {
			const { user_id, workspace_id, permissions } = data;

			const invitedUser = await DB.User.findByPk(user_id);

			if (!invitedUser) {
				throw {
					action: ACTION_CODES.USER_NOT_FOUND,
					status: STATUS_CODES.NOT_FOUND,
				}
			}

			const invitedWorkspace = await DB.Workspace.findByPk(workspace_id);

			if (!invitedWorkspace) {
				throw {
					action: ACTION_CODES.WORKSPACE_NOT_FOUND,
					status: STATUS_CODES.NOT_FOUND,
				}
			} else if (invitedWorkspace.is_personal) {
				throw {
					action: ACTION_CODES.WORKSPACE_IS_PERSONAL,
					status: STATUS_CODES.FORBIDDEN,
				}
			}

			const invitedWorkspaceUsers = await DB.WorkspaceUsers.findOne({
				where: {
					workspace_id,
					user_id,
				}
			});

			if (invitedWorkspaceUsers) {
				throw {
					action: ACTION_CODES.USER_ALREADY_WORKSPACE_MEMBER,
					status: STATUS_CODES.CONFLICT,
				}
			}

			const activationCode = generateCode();

			const actionCode = await DB.ActionCodes.create(
				{
					user_id: invitedUser.id,
					code: activationCode,
					extra_data: JSON.stringify({ permissions }),
					type: ACTION_CODES_TYPES.WORKSPACE_INVITE,
					expires_at: addTimestamp(ACTION_CODES_EXPIRES.EMAIL_VERIFICATION, true)
				},
			);

			const activationLink = `https://example.test/auth/signup/confirm?user_id=${invitedUser.id}&code_id=${actionCode.id}&code=${activationCode}`; // todo add host for confirm email

			MailService.sendMail({
				to: invitedUser.email,
				subject: 'Приглашение в доску',
				html: `
            <a href="${activationLink}">Приглашение в доску ID: ${workspace_id}</a>
            <p>Code: ${activationCode}</p>
            <p>Code ID: ${actionCode.id}</p>
            <p>User ID: ${invitedUser.id}</p>
          `
			});
		} catch (e) {
			throw new HttpError(e.action, e.status);
		}
	}
}

export default new Workspace();
