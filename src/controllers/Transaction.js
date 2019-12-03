import { Op } from 'sequelize';
import DB from '../config/db';
import {
  redisDelAsync,
} from '../config/redis';
import {
  errorFormatter,
  HttpError,
  setResponseError,
  setResponseErrorValidation,
  checkValidationErrors,
} from "../helpers/errorHandler";
import {
  getMultipleQueryValues,
  getMultipleWhere,
  getDateWhere,
  getWhere,
  getMultipleOrder,
} from '../helpers/sql';
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { getPagination } from '../helpers/pagination';
import { removeEmpty } from '../helpers';
import { validationResult } from 'express-validator/check';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';
import StructuredDataService from '../services/structuredData';

class Transaction {
  static TransactionData = (req) => removeEmpty({
    type: req.body.type,
    sum: req.body.sum,
    category_id: req.body.category_id,
    currency_id: req.body.currency_id,
    contragent_id: req.body.contragent_id,
    project_id: req.body.project_id,
    registered_at: req.body.registered_at,
    comment: req.body.comment,
  });

  static TransactionFiles = (req) => removeEmpty({
    file_id: req.body.file_id,
  });

  getTransactionList = async (req, res) => {
    try {
      await checkValidationErrors(req);
      const { workspace_id } = req.params;

      const where = getWhere(
        req.query,
        {
          queryList: ['type', 'category_id', 'currency_id', 'contragent_id', 'project_id'],
          maybeMultipleQuery: ['category_id', 'currency_id', 'contragent_id', 'project_id'],
          valFromTo: [
            { key: 'sum', from: 'sum_from', to: 'sum_to' },
            { key: 'registered_at', from: 'register_date_start', to: 'register_date_end', factor: 1000 },
          ],
        }
      );

      where['workspace_id'] = workspace_id;

      where['invalidated_at'] = {
        [Op.eq]: null,
      };

      const data = await StructuredDataService.withPagination(req, where, TransactionService.count, TransactionService.getList);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getTransactionSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, transaction_id } = req.params;
      const transaction = await TransactionService.getSingle(transaction_id, workspace_id);

      if (!transaction) {
        return res.status(STATUS_CODES.NOT_FOUND).send()
      }

      return res.status(STATUS_CODES.OK).json(transaction);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  createTransaction = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        params: {
          workspace_id,
        },
        decoded: {
          userId: user_id,
        }
      } = req;

      const transactionCreate = await TransactionService.createTransaction(
        workspace_id,
        user_id,
        Transaction.TransactionData(req),
        Transaction.TransactionFiles(req),
      );

      const transaction = await TransactionService.getSingle(transactionCreate.id, workspace_id);

      // await redisDelAsync(`cash:${workspace_id}`);

      return res.status(STATUS_CODES.CREATED).json(transaction);
    } catch (err) {
      // console.log(err)
      return setResponseError(res, err)
    }
  };

  editTransaction = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        params: {
          transaction_id,
        },
        body: {
          type, category_id, currency_id, contragent_id, file_id, registered_at, sum, comment
        },
      } = req;

      const transaction = await TransactionService.editTransaction(transaction_id, removeEmpty({
        type,
        category_id,
        currency_id,
        contragent_id,
        file_id,
        registered_at,
        sum,
        comment,
      }));

      return res.status(STATUS_CODES.OK).json(transaction);
    } catch (err) {
      console.log(err)
      return setResponseError(res, err);
    }
  };

  invalidateTransaction = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, transaction_id } = req.params;

      const transaction = await TransactionService.invalidate(transaction_id, workspace_id);

      return res.status(STATUS_CODES.OK).json(transaction);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getSummary = async (req, res) => {
    try {
      const cash = await CashService.getCash({
        workspace_id: 1,
        user_id: req.decoded.userId,
      })
      // return res.status(STATUS_CODES.OK).json({
      //   accrualAmount: 0,
      //   accrualCount: 0,
      //   accrualFullAmount: 0,
      //   incomeAmount: 9810000,
      //   incomeCount: 32,
      //   incomeFullAmount: 9810000,
      //   moveAmount: 0,
      //   moveCount: 4,
      //   moveFullAmount: 0,
      //   outcomeAmount: 9530395,
      //   outcomeCount: 161,
      //   outcomeFullAmount: 9530395,
      // });
    } catch (err) {
      return setResponseError(res, err);
    }

    // CashService

  }
}

export default new Transaction();
