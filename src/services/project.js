import DB from '../config/db';
import { HttpError } from './errors';
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import TransactionService from './transaction';

class Project {
  count = async (where) => DB.Project.count({ where });

  getSingle = async (id, workspace_id, options = {}) => DB.Project.findOne({
    where: {
      id,
      workspace_id,
    },
    attributes: {
      exclude: ['contragent_id']
    },
    include: [{
      model: DB.Contragent,
      attributes: {
        exclude: ['workspace_id']
      }
    }]
  }, options);

  getList = async (options = {}, expand = true) => DB.Project.findAll({
    attributes: {
      exclude: ['contragent_id', 'workspace_id']
    },
    include: [{
      model: DB.Contragent,
      attributes: ['id', 'title', 'type', 'active']
    }],
    json: true,
    ...options,
  });

  create = async (workspace_id, data) => {
    const actualData = await DB.Project.findOne({ where: { name } });

    if (actualData) {
      throw new HttpError(ACTION_CODE.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    return DB.Project.create({ workspace_id, ...data });
  };

  delete = async (project_id, workspace_id) => {
    const actualData = await this.getSingle(project_id, workspace_id);

    if (!actualData) {
      throw new HttpError(ACTION_CODE.PROJECT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (parseInt(actualData.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODE.UNKNOWN_ERROR, HTTP_STATUS.FORBIDDEN);
    }

    const hasTransaction = await TransactionService.count({
      project_id,
    });

    if (hasTransaction) {
      throw new HttpError(ACTION_CODE.CANNOT_BE_DELETED, HTTP_STATUS.CONFLICT);
    }

    return DB.Project.destroy({ where: { id: project_id } });
  };

  edit = async (id, workspace_id, data) => {
    const project = await this.getSingle(id, workspace_id);

    if (!project) {
      throw new HttpError(ACTION_CODE.PROJECT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (parseInt(project.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODE.UNKNOWN_ERROR, HTTP_STATUS.FORBIDDEN);
    }

    Object.keys(data).forEach(key => {
      project.set(key, data[key]);
    });

    return project.save();
  };
}

export default new Project();
