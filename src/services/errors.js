import { HTTP_STATUS, ACTION_CODE } from '../constants';
import { validationResult } from 'express-validator';

export class HttpError extends Error {
	constructor(action = ACTION_CODE.UNKNOWN_ERROR, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, extra = {}) {
		super();

		this.action = action;
		this.extra = extra;
		this.status = status;
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}

export const errorFormatter = errors => ({
	field: errors.param,
	action: errors.msg
});

export const setResponseError = (res, err = 'Server Error') => {
	if (typeof err === 'object' && err.action && err.status) {
		const objectPayload = {
			action: err.action,
		};

		if (err.extra) {
			objectPayload['extra'] = err.extra;
		}

		return res.status(err.status).json(objectPayload);
	} else {
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			action: err
		});
	}
};

export const checkValidationErrors = (req) => new Promise((resolve, reject) => {
	const errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		return reject(new HttpError(
			ACTION_CODE.VALIDATION_FAILED,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			errors.array({
				onlyFirstError: true
			}))
		);
	}

	return resolve();
});
