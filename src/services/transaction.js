import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Transaction {
  getSingle = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Transaction.findOne({
        where: {
          ...data,
        }, ...options
      });
    }

    return DB.Transaction.findByPk(data, options);
  };

  getList = async (options = {}) => {
    return DB.Transaction.findAll(options)
  };

  createTransaction = async (data) => {
    // try {
    //
    // } catch (e) {
    //
    // }
  }
}

export default new Transaction();
