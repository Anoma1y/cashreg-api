import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Category {
  count = (where) => DB.Category.count({ where });

  getSingle = async (id, workspace_id, options = {}) => await DB.Category.findOne({
    where: {
      id,
      workspace_id,
    },
    include: [{
      model: DB.Category,
      as: 'children',
      attributes: {
        exclude: ['type', 'workspace_id', 'parent_id'],
      }
    }],
  }, options);

  getList = async (options = {}) => DB.Category.findAll({
    attributes: {
      exclude: ['workspace_id', 'parent_id'],
    },
    include: [{
      model: DB.Category,
      as: 'children',
      attributes: {
        exclude: ['type', 'workspace_id', 'parent_id'],
      }
    }],
    json: true,
    ...options,
  });

  create = async (data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const category = await DB.Category.findOne({ where: { name } });

      if (category) {
        throw {
          action: ACTION_CODES.USER_ALREADY_EXISTS,
          status: STATUS_CODES.CONFLICT,
        };
      }

      return DB.Category.create({
        name,
        description,
        workspace_id,
        type,
      });
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };

  delete = async (category_id, workspace_id) => {
    const category = await this.getSingle(category_id);

    if (!category) {
      throw {
        action: ACTION_CODES.CATEGORY_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    if (parseInt(category.workspace_id) !== parseInt(workspace_id)) {
      throw {
        action: ACTION_CODES.UNKNOWN_ERROR,
        status: STATUS_CODES.FORBIDDEN,
      };
    }

    return DB.Category.destroy({ where: { id: category_id } });
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

      if (parseInt(category.workspace_id) !== parseInt(workspace_id)) {
        throw {
          action: ACTION_CODES.UNKNOWN_ERROR,
          status: STATUS_CODES.FORBIDDEN,
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

      return category.save();
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };
}

export default new Category();
