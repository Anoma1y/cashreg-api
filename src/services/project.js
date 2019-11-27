import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';
import TransactionService from './transaction';

class Project {
  count = (where) => DB.Project.count({ where });

  getSingle = async (id, workspace_id, options = {}) => DB.Project.findOne({
    where: {
      id,
      workspace_id,
    },
    attributes: {
      exclude: ['contragent_id', 'workspace_id']
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
      attributes: {
        exclude: ['workspace_id']
      }
    }],
    json: true,
    ...options,
  });

  create = async (data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const project = await DB.Project.findOne({ where: { name } });

      if (project) {
        throw {
          action: ACTION_CODES.USER_ALREADY_EXISTS,
          status: STATUS_CODES.CONFLICT,
        };
      }

      return DB.Project.create({
        name,
        description,
        workspace_id,
        type,
      });
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };

  delete = async (project_id, workspace_id) => {
    const project = await this.getSingle(project_id);

    if (!project) {
      throw {
        action: ACTION_CODES.CATEGORY_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    if (parseInt(project.workspace_id) !== parseInt(workspace_id)) {
      throw {
        action: ACTION_CODES.UNKNOWN_ERROR,
        status: STATUS_CODES.FORBIDDEN,
      };
    }

    return DB.Project.destroy({ where: { id: project_id } });
  };

  edit = async (project_id, data) => {
    const { name, description, workspace_id, type, } = data;

    try {
      const project = await this.getSingle(project_id);

      if (!project) {
        throw {
          action: ACTION_CODES.CATEGORY_NOT_FOUND,
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      if (parseInt(project.workspace_id) !== parseInt(workspace_id)) {
        throw {
          action: ACTION_CODES.UNKNOWN_ERROR,
          status: STATUS_CODES.FORBIDDEN,
        };
      }

      if (name) {
        project['name'] = name;
      }

      if (description) {
        project['description'] = description;
      }

      if (type) {
        project['type'] = type;
      }

      return project.save();
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };
}

export default new Project();
