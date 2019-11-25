import { Op } from 'sequelize';
import DB from '../config/db';
import {
  redisSetAsync,
  redisGetAsync,
} from '../config/redis';
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
import uuid from 'uuid/v4';

class Cash {
  getCash = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        query: {
          currency_id,
          category_id,
          contragent_id,
          type,
          date_from,
          date_to,
        },
        params: {
          workspace_id,
        },
      } = req;

      let cash = [];

      const isFilter = Object.keys(removeEmpty({
        currency_id,
        category_id,
        contragent_id,
        type,
        date_from,
        date_to
      })).length !== 0;

      if (isFilter) {
        cash = await CashService.getCash(workspace_id, req.query); // todo fix
      } else {
        const cacheCash = null; /*await redisGetAsync(`cash:${workspace_id}`);*/

        if (cacheCash) {
          cash = JSON.parse(cacheCash);
        } else {
          cash = await CashService.getCash(workspace_id);

          await redisSetAsync(`cash:${workspace_id}`, JSON.stringify(cash), 'EX', 3600);
        }
      }

      return res.status(STATUS_CODES.OK).json(cash);
    } catch (err) {
      return setResponseError(res, err)
    }
  };
}

export default new Cash();
