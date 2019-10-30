import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import MailService from './mail';

class Workspace {
	getUserWorkspaceByUserId = async (user_id) => {
		return DB.WorkspaceUsers.findOne({
			where: {
				user_id,
			},
			plain: true,
		})
	};

	inviteUser = async (data) => {

	}
}

export default new Workspace();
