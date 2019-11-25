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
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { getPagination } from '../helpers/pagination';
import { removeEmpty } from '../helpers';
import { validationResult } from 'express-validator/check';
import TransactionService from '../services/transaction';
import CashService from '../services/cash';

class Transaction {
  getTransactionList = async (req, res) => {
    try {
      await checkValidationErrors(req);
      const { workspace_id } = req.params;

      const {
        register_date_start,
        register_date_end,
        sum_from,
        sum_to,
        currency_id,
        category_id,
        contragent_id,
        project_id,
        type,
        order_by_direction = 'desc',
        order_by_key = 'id',
      } = req.query;

      const where = removeEmpty({
        category_id,
        currency_id,
        contragent_id,
        workspace_id,
        project_id,
        type,
      });

      if (where.category_id && where.category_id.length > 1) {
        where['category_id'] = {
          [Op.in]: category_id.replace(/\s/g, '').split(',')
        }
      }

      if (where.currency_id && where.currency_id.length > 1) {
        where['currency_id'] = {
          [Op.in]: currency_id.replace(/\s/g, '').split(',')
        }
      }

      if (where.contragent_id && where.contragent_id.length > 1) {
        where['contragent_id'] = {
          [Op.in]: contragent_id.replace(/\s/g, '').split(',')
        }
      }

      if (where.project_id && where.project_id.length > 1) {
        where['project_id'] = {
          [Op.in]: project_id.replace(/\s/g, '').split(',')
        }
      }

      where['invalidated_at'] = {
        [Op.eq]: null,
      };

      if (sum_from && sum_to) {
        where['sum'] = {
          [Op.gte]: sum_from,
          [Op.lte]: sum_to,
        };
      } else if (sum_from && !sum_to) {
        where['sum'] = {
          [Op.gte]: sum_from,
        }
      } else if (!sum_from && sum_to) {
        where['sum'] = {
          [Op.lte]: sum_to,
        }
      }

      if (register_date_start && register_date_end) { // todo need fix timezone
        where['registered_at'] = {
          [Op.gte]: register_date_start * 1000,
          [Op.lte]: register_date_end * 1000,
        };
      } else if (register_date_start && !register_date_end) {
        where['registered_at'] = {
          [Op.gte]: register_date_start * 1000,
        }
      } else if (!register_date_start && register_date_end) {
        where['registered_at'] = {
          [Op.lte]: register_date_end * 1000,
        }
      }

      const order = [[order_by_key, order_by_direction]]; // todo add array

      const total_records = await DB.Transaction.count({ where });

      const { page, num_on_page, offset, limit } = getPagination(req, total_records);

      if (total_records === 0) {
        return res.status(STATUS_CODES.OK).json({
          page: 1,
          data: [],
          num_on_page,
          total_records
        });
      }

      const data = await TransactionService.getList({
        offset,
        limit,
        where,
        order,
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

      const transactionCreate = await TransactionService.createTransaction({
        data: req.body,
        user_id,
        workspace_id,
      });

      const transaction = await TransactionService.getSingle(transactionCreate.id, workspace_id);

      // await redisDelAsync(`cash:${workspace_id}`);

      return res.status(STATUS_CODES.CREATED).json(transaction);
    } catch (err) {
      console.log(err)
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
