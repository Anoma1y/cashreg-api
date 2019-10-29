import ACTION_CODES from "../../../helpers/actionCodes";
import { query } from 'express-validator';

const validateQueryArray = val => {
	const arr = val.split(',').filter(Boolean).map(v => Number(v));

	return !!(Array.isArray(arr) && arr.every(a => Number.isInteger(a)));
};

const getCash = [
	query('workspace_id', ACTION_CODES.EMPTY_FIELD_WORKSPACE_ID)
		.exists()
		.isNumeric(),
	query('currency_id', ACTION_CODES.EMPTY_FIELD_CURRENCY_ID)
		.optional()
		.custom(validateQueryArray),
	query('contragent_id', ACTION_CODES.EMPTY_FIELD_CONTRAGENT_ID)
		.optional()
		.custom(validateQueryArray),
	query('category_id', ACTION_CODES.EMPTY_FIELD_CATEGORY_ID)
		.optional()
		.custom(validateQueryArray),
	query('type', ACTION_CODES.EMPTY_FIELD_TYPE)
		.optional()
		.isNumeric(),
];

export default {
	getCash,
};