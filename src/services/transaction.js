import DB, { sequelize } from '../config/db';
import { HttpError } from '../services/errors';
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import CashService from './cash';
import CategoryService from './category';
import ContragentService from './contragent';
import ProjectService from './project';

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

  checkNegativeCash = async (workspace_id, data, reverse = false) => {
    const { currency_id, sum, type } = data;

    if (!workspace_id || !currency_id || !sum || !type) return true;

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

  createTransaction = async (workspace_id, user_id, data, files) => {
    const isNegative = await this.checkNegativeCash(workspace_id, data);

    if (isNegative) {
      throw new HttpError(ACTION_CODE.TRANSACTION_CASH_NEGATIVE, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    if (data.category_id) {
      const category = await CategoryService.getSingle(data.category_id,workspace_id, { attributes: ['id', 'type'] });

      if (!category) {
        throw new HttpError('CATEGORY_NOT_FOUND', 404);
      }

      if (category.type !== data.type) {
        throw new HttpError('CATEGORY_TYPE_NOT_MATCH', 404);
      }
    }

    if (data.contragent_id) {
      const contragent = await ContragentService.getSingle(data.contragent_id,workspace_id, { attributes: ['id'] });

      if (!contragent) {
        throw new HttpError('CONTRAGENT_NOT_FOUND', 404);
      }
    }

    if (data.project_id) {
      const project = await ProjectService.getSingle(data.project_id,workspace_id, { attributes: ['id'] });

      if (!project) {
        throw new HttpError('PROJECT_NOT_FOUND', 404);
      }
    }

    return await sequelize.transaction().then(async (transaction) => {
      try {
        const transactionCreate = await DB.Transaction.create(
          {
            user_id,
            workspace_id,
            type: data.type,
            category_id: data.category_id,
            currency_id: data.currency_id,
            contragent_id: data.contragent_id,
            registered_at: data.registered_at,
            sum: data.sum,
            comment: data.comment,
          },
          {transaction}
        );
        const { file_id } = files;

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
          throw new HttpError(ACTION_CODE.USER_CREATED_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
      }
    });
  };

  editTransaction = async (transaction_id, data) => {
    const transaction = await this.getSingle(transaction_id);

    if (!transaction) {
      throw new HttpError(ACTION_CODE.TRANSACTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    if (transaction.invalidated_at !== null) {
      throw new HttpError(ACTION_CODE.TRANSACTION_ALREADY_INVALIDATED, HTTP_STATUS.FORBIDDEN)
    }

    Object.keys(data).forEach(key => {
      transaction.set(key, data[key]);
    });

    return transaction.save();
  };

  invalidate = async (id, workspace_id) => {
    const transaction = await this.getSingle(id, workspace_id, false);

    if (!transaction) {
      throw new HttpError(ACTION_CODE.TRANSACTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    if (transaction.invalidated_at !== null) {
      throw new HttpError(ACTION_CODE.TRANSACTION_ALREADY_INVALIDATED, HTTP_STATUS.CONFLICT)
    }

    if (await this.checkNegativeCash({
      transaction_id: id,
      workspace_id,
      currency_id: transaction.currency_id,
      sum: transaction.sum,
      type: transaction.type,
    }, true)) {
      throw new HttpError(ACTION_CODE.USER_CREATED_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    transaction.invalidated_at = +new Date();

    return transaction.save();
  }
}

export default new Transaction();
