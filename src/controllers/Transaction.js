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

class Transaction {
  getTransactionList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        register_date_start,
        register_date_end,
        sum_from,
        sum_to,
        currency_id,
        category_id,
        contragent_id,
        type,
        order_by_direction = 'desc',
        order_by_key = 'id',
      } = req.query;

      const where = removeEmpty({
        category_id,
        currency_id,
        contragent_id,
        type,
      });

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
        attributes: {
          exclude: [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id', ],
        },
        where,
        order,
        include: [
          {
            model: DB.Category,
            attributes: {
              exclude: ['workspace_id', 'created_at', 'updated_at', 'deleted_at'],
            },
          },
          {
            model: DB.Currency,
            attributes: {
              exclude: ['created_at', 'updated_at'],
            },
          },
          {
            model: DB.Contragent,
            attributes: {
              exclude: ['workspace_id', 'created_at', 'updated_at'],
            },
          },
          {
            model: DB.Workspace,
            attributes: {
              exclude: ['created_at', 'updated_at', 'deleted_at'],
            },
          },
          {
            model: DB.User,
            attributes: {
              exclude: ['password', 'created_at', 'updated_at'],
            },
            include: [
              {
                model: DB.Profile,
                attributes: {
                  exclude: ['created_at', 'updated_at', 'id'],
                },
              },
            ],
          },
        ],
        json:true,
      });

      return res.status(STATUS_CODES.OK).json({
        page,
        data,
        num_on_page,
        total_records
      });
    } catch (err) {
      console.log(err)
      return setResponseError(res, err);
    }
  };
}

export default new Transaction();
