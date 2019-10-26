import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Contragent {
  getSingle = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Contragent.findOne({
        where: {
          ...data,
        }, ...options
      });
    }

    return DB.Contragent.findByPk(data, options);
  };

  getList = async (options = {}) => DB.Contragent.findAll(options);

  create = async (data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const category = await DB.Contragent.findOne({ where: { name } });

      if (category) {
        throw {
          action: ACTION_CODES.USER_ALREADY_EXISTS,
          status: STATUS_CODES.CONFLICT,
        };
      }

      return DB.Contragent.create({
        name,
        description,
        workspace_id,
        type,
      });
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };

  delete = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Contragent.destroy({
        where: {
          ...data
        }, ...options
      });
    }

    return DB.Contragent.destroy({ where: { id: data }, ...options });
  };

  edit = async (category_id, data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const category = await this.getSingle(category_id);

      if (!category) {
        throw {
          action: ACTION_CODES.CATEGORY_NOT_FOUND,
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      if (name) {
        category['name'] = name;
      }

      if (description) {
        category['description'] = description;
      }

      if (type) {
        category['type'] = type;
      }

      if (workspace_id) {
        category['workspace_id'] = workspace_id;
      }

      return category.save();
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };
}

export default new Contragent();
