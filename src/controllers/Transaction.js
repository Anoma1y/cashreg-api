import DB from '../config/db';
import { Op } from 'sequelize';
import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { TransactionInclude, TransactionIncludeSingle } from '../models/TransactionIncludes';
import { getWhere, getOrder } from '../helpers/sql';
import { HTTP_STATUS } from '../constants';
import { removeEmpty } from '../helpers';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';

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
      const { page, num_on_page } = req.query;
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

      const options = {
        page,
        num_on_page,
        where,
        order: getOrder(req.query),
        include: TransactionInclude
      };

      const data = await DB.Transaction.paginate(options);

      return res.status(HTTP_STATUS.OK).json(data);
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
        return res.status(HTTP_STATUS.NOT_FOUND).send()
      }

      return res.status(HTTP_STATUS.OK).json(transaction);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  createTransaction = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const transactionCreate = await TransactionService.createTransaction(
        req.params.workspace_id,
        req.decoded.userId,
        Transaction.TransactionData(req),
        Transaction.TransactionFiles(req),
      );

      const transaction = await TransactionService.getSingle(transactionCreate.id, req.params.workspace_id);

      // await redisDelAsync(`cash:${workspace_id}`);

      return res.status(HTTP_STATUS.CREATED).json(transaction);
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

      return res.status(HTTP_STATUS.OK).json(transaction);
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

      return res.status(HTTP_STATUS.OK).json(transaction);
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
      // return res.status(HTTP_STATUS.OK).json({
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
