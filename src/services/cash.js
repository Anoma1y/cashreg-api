import { Op } from 'sequelize';
import DB from '../config/db';
import { redisGetAsync, redisSetAsync } from '../config/redis';
import { HttpError } from '../helpers/errorHandler';
import { removeEmpty } from '../helpers';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';

const getRawWhereIn = (field, arr, separate = true) => { // todo go to utils
	if (!arr) return '';

	const formattedArray = arr.split(',').filter(Boolean).join(',');

	return `${separate ? 'and ' : ''}${field} in (${formattedArray})`;
};

const getRawWhere = (field, val, separate = true) => val ? `${separate ? 'and ' : ''}${field} = ${val}` : ''; // todo go to utils

class Cash {
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
				select id as currency_id, (
	        SELECT SUM(CASE WHEN t.type = 2 THEN t.sum ELSE -t.sum END)
	        FROM transactions t
	        WHERE c.id = t.currency_id and t.workspace_id = ${workspace_id} and t.invalidated_at is null
	        	${getRawWhereIn('t.category_id', category_id)}
	        	${getRawWhereIn('t.contragent_id', contragent_id)}
	        	${getRawWhereIn('t.category_id', category_id)}
	        	${getRawWhere('t.type', type)}
				)
				from currencies as c
				WHERE exists(SELECT workspace_id FROM workspace_users as wu WHERE wu.workspace_id = ${workspace_id})
				${getRawWhereIn('c.id', currency_id)}
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
