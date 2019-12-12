import STATUS_CODES from './statusCodes';
import ACTION_CODES from "./actionCodes";
import { validationResult } from 'express-validator';

export class HttpError extends Error {
  constructor(action = ACTION_CODES.UNKNOWN_ERROR, status = STATUS_CODES.INTERNAL_SERVER_ERROR, extra = {}) {
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
      extra: err.extra
    };

    return res.status(err.status).json(objectPayload);
  } else {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      action: err
    });
  }
};

export const checkValidationErrors = (req) => new Promise((resolve, reject) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  
  if (!errors.isEmpty()) {
    return reject(new HttpError(
      ACTION_CODES.VALIDATION_FAILED,
      STATUS_CODES.UNPROCESSABLE_ENTITY,
      errors.array({
        onlyFirstError: true
      }))
    );
  }
  
  return resolve();
});
