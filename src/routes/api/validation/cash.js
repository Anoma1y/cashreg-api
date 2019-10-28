import ACTION_CODES from "../../../helpers/actionCodes";
import { query } from 'express-validator';

const getCash = [
	query('workspace_id', ACTION_CODES.EMPTY_FIELD_WORKSPACE_ID)
		.exists()
		.isNumeric(),
	query('currency_id', ACTION_CODES.EMPTY_FIELD_CURRENCY_ID)
		.optional()
		.custom(val => {
			const arr = val.split(',').filter(Boolean).map(v => Number(v));

			return !!(Array.isArray(arr) && arr.every(a => Number.isInteger(a)));
		})
];

export default {
	getCash,
};
