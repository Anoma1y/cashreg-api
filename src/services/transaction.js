import DB, { sequelize } from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import CashService from './cash';

class Transaction {
  static TransactionInclude = [
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
  ];

  static TransactionIncludeSingle = [
    {
      model: DB.File,
      as: 'files',
      through: { attributes: [] }
    }
  ];

  count = (where) => DB.Transaction.count({ where });

  checkNegativeCash = async (data, reverse = false) => {
    const { workspace_id, currency_id, sum, type } = data;

    const cash = await CashService.getCash(workspace_id);
    const currentCash = cash.find(c => c.currency_id === currency_id);

    return type === (reverse ? 2 : 1) && (currentCash.sum - sum) < 0;
  };

  getSingle = async (id, workspace_id, expand = true) => {
    return DB.Transaction.findOne({
      where: { id, workspace_id },
      attributes: {
        exclude: expand ? [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id'] : [],
      },
      include: expand ? [
        ...Transaction.TransactionInclude,
        ...Transaction.TransactionIncludeSingle,
      ] : [],
      json: true,
    });
  };

  getList = async (options = {}, expand = true) => {
    return DB.Transaction.findAll({
      attributes: {
        exclude: [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id', ],
      },
      include: expand ? Transaction.TransactionInclude : [],
      json:true,
      ...options,
    })
  };

  createTransaction = async (data) => {
    const {
      data: {
        type,
        category_id,
        currency_id,
        contragent_id,
        file_id,
        registered_at,
        sum,
        comment,
      },
      workspace_id,
      user_id,
    } = data;

    if (await this.checkNegativeCash(data)) {
      throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.UNPROCESSABLE_ENTITY);
    }

    return await sequelize.transaction().then(async (transaction) => {
      try {

        const transactionCreate = await DB.Transaction.create(
          {
            user_id,
            workspace_id,
            type,
            category_id,
            currency_id,
            contragent_id,
            registered_at,
            sum,
            comment,
          },
          {transaction}
        );

        if (file_id && file_id.length !== 0) {
          await DB.TransactionFiles.bulkCreate(file_id.map(id => ({
              file_id: id,
              transaction_id: transactionCreate.id,
            })),
            {transaction}
          );
        }

        await transaction.commit();

        return transactionCreate;
      } catch (e) {
        await transaction.rollback().then(() => {
          throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        });
      }
    });
  };

  editTransaction = async (transaction_id, data) => {
    const transaction = await this.getSingle(transaction_id);

    if (!transaction) {
      throw new HttpError(ACTION_CODES.TRANSACTION_NOT_FOUND, STATUS_CODES.NOT_FOUND)
    }

    if (transaction.invalidated_at !== null) {
      throw new HttpError(ACTION_CODES.TRANSACTION_ALREADY_INVALIDATED, STATUS_CODES.FORBIDDEN)
    }

    Object.keys(data).forEach(key => {
      transaction.set(key, data[key]);
    });

    return transaction.save();
  };

  invalidate = async (id, workspace_id) => {
    const transaction = await this.getSingle(id, workspace_id, false);

    if (!transaction) {
      throw new HttpError(ACTION_CODES.TRANSACTION_NOT_FOUND, STATUS_CODES.NOT_FOUND)
    }

    if (transaction.invalidated_at !== null) {
      throw new HttpError(ACTION_CODES.TRANSACTION_ALREADY_INVALIDATED, STATUS_CODES.CONFLICT)
    }

    if (await this.checkNegativeCash({
      transaction_id: id,
      workspace_id,
      currency_id: transaction.currency_id,
      sum: transaction.sum,
      type: transaction.type,
    }, true)) {
      throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.UNPROCESSABLE_ENTITY);
    }

    transaction.invalidated_at = +new Date();

    return transaction.save();
  }
}

export default new Transaction();
