import { Op } from 'sequelize';
import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import { removeEmpty } from '../helpers';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';

class Cash {
	getCash = async (data) => {
		const {
			currency_id,
			workspace_id,
			user_id
		} = data;

		const currencies = currency_id ? `and c.id in (${currency_id.split(',').filter(Boolean).join(',')})` : '';

		try {

			const [data] = await DB.sequelize.query(`
				select id as currency_id, (
	        SELECT SUM(CASE WHEN t.type = 2 THEN t.sum ELSE -t.sum END)
	        FROM transactions t
	        WHERE c.id = t.currency_id and t.workspace_id = ${workspace_id}
				)
				from currencies as c
				WHERE exists(SELECT workspace_id, user_id FROM workspace_users as wu WHERE wu.user_id = ${user_id} AND wu.workspace_id = ${workspace_id})
				${currencies}
			`, {
				json: true,
			});

			return data.filter(d => d.sum).map(d => ({...d, sum: parseInt(d.sum)}));
		} catch (e) {
			throw new HttpError(e.action, e.status);
		}
	}
}

export default new Cash();
