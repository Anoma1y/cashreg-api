import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Transaction {
  getList = async (options = {}) => {
    return DB.Transaction.findAll(options)
  };
}

export default new Transaction();
