import DB from '../config/db';
import { errorFormatter, HttpError, setResponseError, setResponseErrorValidation } from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { validationResult } from 'express-validator/check';
import Permissions from '../helpers/permissions';

class Permission {
	getList = async (req, res) => {
		return res.status(STATUS_CODES.OK).json(Permissions.PermissionList);
	}
}

export default new Permission();
