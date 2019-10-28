import ACTION_CODES from "../../../helpers/actionCodes";
import { check, param } from 'express-validator';
import {
	checkTransactionType,
	aboveZero,
} from './utils';

const createTransaction = [
	param('workspace_id')
		.exists()
		.isNumeric(),
	check('type', ACTION_CODES.EMPTY_FIELD_TYPE)
		.exists()
		.isNumeric()
		.custom(checkTransactionType),
	check('sum', ACTION_CODES.EMPTY_FIELD_SUM)
		.exists()
		.isNumeric()
		.custom(aboveZero),
	check('category_id')
		.exists()
		.isNumeric(),
	check('currency_id')
		.exists()
		.isNumeric(),
	check('contragent_id')
		.optional()
		.isNumeric(),
	check('registered_at')
		.optional()
		.isNumeric(),
	check('comment', ACTION_CODES.EMPTY_FIELD_COMMENT)
		.optional()
		.isString()
		.trim()
		.isLength({ max: 1000 }),
];

const getTransaction = [

];

export default {
	getTransaction,
	createTransaction,
};
