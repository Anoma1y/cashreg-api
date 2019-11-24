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
    try {
      const contragent = await DB.Contragent.findOne({ where: { title: data.title } });

      if (contragent) {
        throw {
          action: ACTION_CODES.USER_ALREADY_EXISTS,
          status: STATUS_CODES.CONFLICT,
        };
      }
      console.log(data)
      return DB.Contragent.create({
        ...data,
      });
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };

  delete = async (contragent_id, workspace_id) => {
    const contragent = await this.getSingle(contragent_id);

    if (!contragent) {
      throw {
        action: ACTION_CODES.CONTRAGENT_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    if (parseInt(contragent.workspace_id) !== parseInt(workspace_id)) { // todo add archived at
      throw {
        action: ACTION_CODES.UNKNOWN_ERROR,
        status: STATUS_CODES.FORBIDDEN,
      };
    }

    return DB.Contragent.destroy({ where: { id: contragent_id } });
  };

  edit = async (contragent_id, data) => {
    try {
      const contragent = await this.getSingle(contragent_id);

      if (!contragent) {
        throw {
          action: ACTION_CODES.CATEGORY_NOT_FOUND,
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      if (parseInt(contragent.workspace_id) !== parseInt(data.workspace_id)) {
        throw {
          action: ACTION_CODES.UNKNOWN_ERROR,
          status: STATUS_CODES.FORBIDDEN,
        };
      }

      if (data.title) {
        contragent['title'] = data.title;
      }

      if (data.longTitle) {
        contragent['longTitle'] = data.longTitle;
      }

      if (data.payment_info) {
        contragent['payment_info'] = data.payment_info;
      }

      if (data.inn) {
        contragent['inn'] = data.inn;
      }

      if (data.kpp) {
        contragent['kpp'] = data.kpp;
      }

      if (data.active !== undefined) {
        contragent['active'] = data.active;
      }

      if (data.title) {
        contragent['title'] = data.title;
      }

      if (data.description) {
        contragent['description'] = data.description;
      }

      return contragent.save();
    } catch (e) {
      throw new HttpError(e.action, e.status);
    }
  };
}

export default new Contragent();
