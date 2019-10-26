import DB from '../config/db';
import {
  errorFormatter,
  HttpError,
  setResponseError,
  setResponseErrorValidation,
  checkValidationErrors,
} from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { validationResult } from 'express-validator/check';
import CurrencyService from '../services/currency';

class Currency {
  getCurrencyList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const data = await CurrencyService.getList({
        attributes: {
          exclude: [
            'created_at',
            'updated_at',
          ]
        },
        json:true,
      });

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getCurrencySingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { currency_id } = req.params;
      const currency = await CurrencyService.getSingle(currency_id, {
        attributes: {
          exclude: [
            'created_at',
            'updated_at',
          ]
        },
        json: true,
      });

      if (!currency) {
        return res.status(STATUS_CODES.NOT_FOUND).send()
      }

      return res.status(STATUS_CODES.OK).json(currency);

    } catch (err) {
      return setResponseError(res, err)
    }
  };
}

export default new Currency();
