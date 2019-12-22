import DB from '../config/db';
import { redisDelAsync } from '../config/redis';
import { HttpError } from '../services/errors';
import { getRawWhereIn, getRawWhere } from '../helpers/sql';
import { HTTP_STATUS, ACTION_CODE } from '../constants';

class Cash {
	invalidateCache = async (workspace_id) => {
		return redisDelAsync(`cash:${workspace_id}`);
	};

	getCash = async (workspace_id, query = {}) => {
		const {
			date_from,
			date_to,
			category_id,
			contragent_id,
			currency_id,
			type,
		} = query;

		try {
			const [data] = await DB.sequelize.query(`
				SELECT id AS currency_id, (
	        SELECT SUM(CASE WHEN t.type = 2 THEN t.sum ELSE -t.sum END)
	        FROM transactions t
	        WHERE c.id = t.currency_id and t.workspace_id = ${workspace_id} AND t.invalidated_at IS NULL
	        	${getRawWhereIn('t.category_id', category_id)}
	        	${getRawWhereIn('t.contragent_id', contragent_id)}
	        	${getRawWhere('t.type', type)}
				)
				FROM currencies AS c
				WHERE EXISTS(SELECT workspace_id FROM workspace_users AS wu WHERE wu.workspace_id = ${workspace_id})
				${getRawWhereIn('c.id', currency_id)} AND c.enabled = TRUE
			`, {
				json: true,
			});

			return data.reduce((acc, cash) => {
				if (cash.sum !== null) {
					acc.push({
						currency_id: cash.currency_id,
						sum: parseInt(cash.sum)
					})
				}

				return acc;
			}, []);
		} catch (e) {
			throw new HttpError(e.action, e.status);
		}
	}
}

export default new Cash();
