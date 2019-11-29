import DB from '../config/db';
import { HttpError } from '../helpers/errorHandler';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

class Contragent {
  count = (where) => DB.Contragent.count({ where });

  getSingle = async (id, workspace_id, options = {}) => DB.Contragent.findOne({
    where: {
      id,
      workspace_id,
    },
  }, options);

  getList = async (options = {}) => DB.Contragent.findAll({
    attributes: {
      exclude: ['workspace_id'],
    },
    json: true,
    ...options,
  });

  create = async (workspace_id, data) => {
    const actualData = await DB.Contragent.findOne({ where: { title: data.title } });

    if (actualData) {
      throw new HttpError(ACTION_CODES.USER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    }

    return DB.Contragent.create({ workspace_id, ...data });
  };

  delete = async (contragent_id, workspace_id) => {
    const actualData = await this.getSingle(contragent_id, workspace_id);

    if (!actualData) {
      throw new HttpError(ACTION_CODES.PROJECT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (parseInt(actualData.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODES.UNKNOWN_ERROR, STATUS_CODES.FORBIDDEN);
    }

    return DB.Contragent.destroy({ where: { id: contragent_id } });
  };

  edit = async (id, workspace_id, data) => {
    const editData = await this.getSingle(id, workspace_id);

    if (!editData) {
      throw new HttpError(ACTION_CODES.PROJECT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (parseInt(editData.workspace_id) !== parseInt(workspace_id)) {
      throw new HttpError(ACTION_CODES.UNKNOWN_ERROR, STATUS_CODES.FORBIDDEN);
    }

    Object.keys(data).forEach(key => {
      editData.set(key, data[key]);
    });

    return editData.save();
  };
}

export default new Contragent();
