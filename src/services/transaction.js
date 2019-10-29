import DB, { sequelize } from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

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

  getSingle = async (transaction_id, options = {}, expand = true) => {
    return DB.Transaction.findByPk(transaction_id, {
      attributes: {
        exclude: [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id', ],
      },
      include: expand ? [
        ...Transaction.TransactionInclude,
        ...Transaction.TransactionIncludeSingle,
      ] : [],
      json: true,
      ...options,
    });
  };

  getList = async (options = {}) => {
    return DB.Transaction.findAll({
      attributes: {
        exclude: [ 'user_id', 'workspace_id', 'contragent_id', 'category_id', 'currency_id', ],
      },
      include: Transaction.TransactionInclude,
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

        if (file_id.length !== 0) {
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
    try {
      const transaction = await this.getSingle(transaction_id);

      if (!transaction) {
        throw {
          action: ACTION_CODES.TRANSACTION_NOT_FOUND,
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      if (transaction.invalidated_at !== null) {
        throw {
          action: ACTION_CODES.TRANSACTION_ALREADY_INVALIDATED,
          status: STATUS_CODES.FORBIDDEN,
        }
      }

      Object.keys(data).forEach(key => {
        transaction.set(key, data[key]);
      });

      return transaction.save();
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };

  invalidate = async (transaction_id) => {
    const transaction = await DB.Transaction.findByPk(transaction_id);

    if (!transaction) {
      throw {
        action: ACTION_CODES.TRANSACTION_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    if (transaction.invalidated_at !== null) {
      throw {
        action: ACTION_CODES.TRANSACTION_ALREADY_INVALIDATED,
        status: STATUS_CODES.CONFLICT,
      };
    }

    transaction.invalidated_at = +new Date();

    return transaction.save();
  }
}

export default new Transaction();
