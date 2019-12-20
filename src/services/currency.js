import DB from '../config/db';
import { HTTP_STATUS, ACTION_CODE } from '../constants';

class Currency {
  getSingle = async (data, options = {}) => {
    if (typeof data === 'object') {
      return DB.Currency.findOne({
        where: {
          ...data,
        }, ...options
      });
    }

    return DB.Currency.findByPk(data, options);
  };

  getList = async (options = {}) => DB.Currency.findAll(options);

  // edit = async (category_id, data) => {
  //   const { name, description, workspace_id, type, } = data;
  //
  //   try {
  //     const category = await this.getSingle(category_id);
  //
  //     if (!category) {
  //       throw {
  //         action: ACTION_CODE.CATEGORY_NOT_FOUND,
  //         status: HTTP_STATUS.NOT_FOUND,
  //       };
  //     }
  //
  //     if (name) {
  //       category['name'] = name;
  //     }
  //
  //     if (description) {
  //       category['description'] = description;
  //     }
  //
  //     if (type) {
  //       category['type'] = type;
  //     }
  //
  //     if (workspace_id) {
  //       category['workspace_id'] = workspace_id;
  //     }
  //
  //     return category.save();
  //   } catch (e) {
  //     throw new HttpError(e.action, e.status);
  //   }
  // };
}

export default new Currency();
