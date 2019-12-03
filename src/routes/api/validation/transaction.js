import ACTION_CODES from "../../../helpers/actionCodes";
import { check, param } from 'express-validator';
import {
	checkTransactionType,
	aboveZero,
	arrayOfNumbers,
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
	check('file_id', ACTION_CODES.EMPTY_FIELD_FILE_ID)
		.optional()
		.isArray()
		.custom(arrayOfNumbers)
		.withMessage('Array file_id should contain only numbers'),
	check('currency_id')
		.exists()
		.isNumeric(),
	check('category_id')
		.optional()
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
