import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import MailService from './mail';

class Workspace {
	getUserWorkspace = async (where = {}) => {
		return DB.WorkspaceUsers.findOne({
			where,
			plain: true,
		})
	};

	inviteUser = async (data) => {

	}
}

export default new Workspace();
