import DB from '../config/db';
import { getOrder } from '../helpers/sql';
import { HTTP_STATUS } from '../constants';
import { setResponseError } from "../services/errors";

class SessionHistory {
	getList = async (req, res) => {
		try {
			const { num_on_page, page } = req.query;

			const options = {
				page,
				num_on_page,
				order: getOrder(req.query),
			};

			const data = await DB.SessionHistory.paginate(options);

			return res.status(HTTP_STATUS.OK).json(data);
		} catch (err) {
			return setResponseError(res, err);
		}
	};
}

export default new SessionHistory();
