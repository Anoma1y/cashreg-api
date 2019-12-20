import { HTTP_STATUS } from '../constants';
import Permissions from '../helpers/permissions';

class Permission {
	getList = async (req, res) => {
		return res.status(HTTP_STATUS.OK).json(Permissions.PermissionList);
	};
}

export default new Permission();
