import DB from '../config/db';
import { HttpError } from '../services/errors';
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import TransactionService from './transaction';

class Category {
  count = (where) => DB.Category.count({ where });

  countChildren = (id) => this.count({ parent_id: id } );

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

  create = async (workspace_id, data) => {
    const actualData = await this.count({ name: data.name });

    if (actualData !== 0) {
      throw new HttpError(ACTION_CODE.CATEGORY_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    if (data.parent_id) {
      const parentData = await DB.Category.findOne({ where: { id: data.parent_id }, attributes: ['id', 'type', 'parent_id'] });

      if (!parentData) {
        throw new HttpError(ACTION_CODE.PARENT_CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      if (parentData.parent_id !== null) {
        throw new HttpError(ACTION_CODE.CATEGORY_CHILDREN_HAVE_ONLY_ONE_PARENT, HTTP_STATUS.IM_A_TEAPOT); // todo change status
      }

      if (parseInt(parentData.type) !== parseInt(data.type)) {
        throw new HttpError(ACTION_CODE.PARENT_CATEGORY_TYPE_NOT_DO_NOT_MATCH, HTTP_STATUS.UNPROCESSABLE_ENTITY)
      }
    }

    return DB.Category.create({ workspace_id, ...data});
  };

  delete = async (category_id, workspace_id) => {
    const actualData = await this.getSingle(category_id, workspace_id);

    if (!actualData) {
      throw new HttpError(ACTION_CODE.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (parseInt(actualData.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODE.UNKNOWN_ERROR, HTTP_STATUS.FORBIDDEN);
    }

    const countChildrenCategory = await this.countChildren(category_id);

    if (countChildrenCategory !== 0) {
      throw new HttpError(ACTION_CODE.CANNOT_BE_DELETED_HAS_CHILDREN_CATEGORY, HTTP_STATUS.CONFLICT);
    }

    const hasTransaction = await TransactionService.count({
      category_id,
    });

    if (hasTransaction) {
      throw new HttpError(ACTION_CODE.CANNOT_BE_DELETED, HTTP_STATUS.CONFLICT);
    }

    return DB.Category.destroy({ where: { id: category_id } });
  };

  edit = async (id, workspace_id, data) => {
    const actualData = await this.getSingle(id, workspace_id);

    if (!actualData) {
      throw new HttpError(ACTION_CODE.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (parseInt(actualData.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODE.UNKNOWN_ERROR, HTTP_STATUS.FORBIDDEN);
    }

    if (actualData.parent_id !== null && parseInt(actualData.type) !== parseInt(data.type)) {
      throw new HttpError(ACTION_CODE.PARENT_CATEGORY_TYPE_NOT_DO_NOT_MATCH, HTTP_STATUS.UNPROCESSABLE_ENTITY)
    }

    if (data.parent_id !== null) {
      const parentData = await this.getSingle(data.parent_id, workspace_id);

      if (parentData.parent_id !== null) {
        throw new HttpError(ACTION_CODE.CATEGORY_CHILDREN_HAVE_ONLY_ONE_PARENT, HTTP_STATUS.IM_A_TEAPOT); // todo change status
      }
    }

    Object.keys(data).forEach(key => {
      actualData.set(key, data[key]);
    });

    return actualData.save();
  };
}

export default new Category();
