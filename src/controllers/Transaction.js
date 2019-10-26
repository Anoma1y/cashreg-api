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
import { validationResult } from 'express-validator/check';
import TransactionService from '../services/transaction';

class Transaction {
  getTransactionList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const total_records = await DB.Transaction.count();
      const { page, num_on_page, offset, limit } = getPagination(req, total_records);

      const data = await TransactionService.getList({
        offset,
        limit,
        attributes: {
          exclude: [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id', ],
        },
        include: [{
          model: DB.Category,
          attributes: {
            exclude: ['workspace_id'],
          },
        }, {
          model: DB.Currency,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        }, {
          model: DB.Contragent,
          attributes: {
            exclude: ['workspace_id', 'created_at', 'updated_at'],
          },
        }, {
          model: DB.Workspace,
        }, {
          model: DB.User,
          attributes: {
            exclude: ['password', 'created_at', 'updated_at'],
          },
          include: [{
            model: DB.Profile,
            attributes: {
              exclude: ['created_at', 'updated_at', 'id'],
            },
          }]
        }],
        json:true,
      });

      return res.status(STATUS_CODES.OK).json({
        page,
        data,
        num_on_page,
        total_records
      });
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Transaction();
