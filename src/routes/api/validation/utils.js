import Schema from '../../../data/schema';
import ACTION_CODES from '../../../helpers/actionCodes';
import Validator from 'validator';

export const editCustomValidate = value => value === null || Validator.isLength(value, { min: 1, max: 255 });

export const checkTransactionType = type => {
	if (Object.keys(Schema.type).includes(String(type))) {
		return true;
	}

	throw new Error(ACTION_CODES.WRONG_TRANSACTION_TYPE)
};

export const checkContragentType = type => {
	if (Object.keys(Schema.contragentType).includes(String(type))) {
		return true;
	}

	throw new Error(ACTION_CODES.WRONG_CONTRAGENT_TYPE)
};

export const aboveZero = val => val > 0;

export const arrayOfNumbers = arr => arr.every(it => Number.isInteger(it));
