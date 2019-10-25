import DB, { sequelize } from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Category {
  getSingle = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Category.findOne({
        where: {
          ...data
        }, ...options
      });
    }

    return DB.Category.findByPk(data, options);
  };

  getList = async (options = {}) => DB.Category.findAll(options);

  create = async (data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const category = await DB.Category.findOne({ where: { name } });

      if (category) {
        throw new HttpError(ACTION_CODES.USER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      return DB.Category.create({
        name,
        description,
        workspace_id,
        type,
      });
    } catch (e) {
      throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  };

  delete = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Category.destroy({
        where: {
          ...data
        }, ...options
      });
    }

    return DB.Category.destroy({ where: { id: data }, ...options });
  };

  edit = async () => {

  };
}

export default new Category();
