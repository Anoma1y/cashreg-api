import { Op } from 'sequelize';
import DB from '../config/db';
import {
	addTimestamp,
	generateCode,
	hashPassword,
} from '../helpers/index';
import { HttpError } from '../services/errors';
import { ACTION_CODE_EXPIRES, ACTION_CODE_TYPES, HTTP_STATUS, ACTION_CODE } from '../constants';

class Workspace {
	getWorkspaceList = async (user_id, opt = {}) => {
		return DB.Workspace.findAll({
			order: [['is_personal', 'desc']],
			include: [{
				model: DB.WorkspaceUsers,
				attributes: ['permissions', 'created_at'],
				as: 'info',
				where: {
					user_id
				}
			}],
			...opt
		})
	};

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
					action: ACTION_CODE.USER_NOT_FOUND,
					status: HTTP_STATUS.NOT_FOUND,
				}
			}

			const invitedWorkspace = await DB.Workspace.findByPk(workspace_id);

			if (!invitedWorkspace) {
				throw {
					action: ACTION_CODE.WORKSPACE_NOT_FOUND,
					status: HTTP_STATUS.NOT_FOUND,
				}
			} else if (invitedWorkspace.is_personal) {
				throw {
					action: ACTION_CODE.WORKSPACE_IS_PERSONAL,
					status: HTTP_STATUS.FORBIDDEN,
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
					action: ACTION_CODE.USER_ALREADY_WORKSPACE_MEMBER,
					status: HTTP_STATUS.CONFLICT,
				}
			}

			const activationCode = generateCode();

			const actionCode = await DB.ActionCodes.create(
				{
					user_id: invitedUser.id,
					code: activationCode,
					extra_data: JSON.stringify({ permissions }),
					type: ACTION_CODE_TYPES.WORKSPACE_INVITE,
					expires_at: addTimestamp(ACTION_CODE_EXPIRES.EMAIL_VERIFICATION, true)
				},
			);
			// todo add send mail after success
			// const activationLink = `https://example.test/auth/signup/confirm?user_id=${invitedUser.id}&code_id=${actionCode.id}&code=${activationCode}`; // todo add host for confirm email
			//
			// MailService.sendMail({
			// 	to: invitedUser.email,
			// 	subject: 'Приглашение в доску',
			// 	html: `
      //       <a href="${activationLink}">Приглашение в доску ID: ${workspace_id}</a>
      //       <p>Code: ${activationCode}</p>
      //       <p>Code ID: ${actionCode.id}</p>
      //       <p>User ID: ${invitedUser.id}</p>
      //     `
			// });
		} catch (e) {
			throw new HttpError(e.action, e.status);
		}
	}

	confirmInvite = async (data) => {
		const {
			user_id,
			code,
			code_id,
		} = data;

		const actionCode = await DB.ActionCodes.findOne({
			where: {
				id: code_id,
				type: ACTION_CODE_TYPES.WORKSPACE_INVITE,
				user_id,
				code,
				claimed_at: null,
				expires_at: {
					[Op.gt]: new Date()
				}
			}
		}).catch(() => {
			throw new HttpError(ACTION_CODE.VERIFY_TOKEN_EXPIRED, HTTP_STATUS.UNPROCESSABLE_ENTITY);
		});

		const user = await DB.User.findByPk(user_id);

		if (!user) {
			throw new HttpError(ACTION_CODE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
		}

		// const transaction = await sequelize.transaction();
		//
		// try {
		// 	profile.is_email_verified = true;
		// 	await profile.save({ transaction });
		//
		// 	actionCode.claimed_at = +new Date();
		// 	await actionCode.save({ transaction });
		//
		// 	await transaction.commit();
		// } catch (e) {
		// 	await transaction.rollback().then(() => {
		// 		throw new HttpError('Err', HTTP_STATUS.INTERNAL_SERVER_ERROR);
		// 	});
		// }
	};
}

export default new Workspace();
