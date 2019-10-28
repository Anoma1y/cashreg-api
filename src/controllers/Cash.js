import { Op } from 'sequelize';
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
import { getPagination } from '../helpers/pagination';
import { removeEmpty } from '../helpers';
import { validationResult } from 'express-validator/check';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';

class Cash {
  getCash = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        query: {
          workspace_id,
          currency_id,
        },
        decoded: {
          userId: user_id,
        }
      } = req;

      const cash = await CashService.getCash({ workspace_id, currency_id, user_id });

      return res.status(STATUS_CODES.OK).json(cash);
    } catch (err) {
      return setResponseError(res, err)
    }
  };
}

export default new Cash();
